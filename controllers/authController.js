
import Modules from '../models.js';
import { sendMail } from "../utils/sendMail.js";
import { loginSchema } from "../utils/zodSchema.js"
import crypto from 'crypto';
import { hashPassword, comparePassword } from "../utils/passwordController.js";
import { generateToken , verifyToken } from "../utils/jwtController.js";

export const login = async ( req , res , next ) => {
    try {

        const isValid = loginSchema.safeParse(req.body);
        if(!isValid.success){
            return res.status(400).json({message: "Unauthorized access."});
        };
        
        const token = crypto.randomBytes(32).toString("hex");
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiry = Date.now() + 300000;
        const email = isValid.data.email.toLowerCase();
        

        const supportManager = await Modules.supportManager.findOne({email})
        if(!supportManager){
            return res.status(404).json({message: "Manager not found"});
        };
        if(supportManager.isBan){
            return res.status(401).json({message: "Manager is banned"});
        };

        const isPasswordMatch = await comparePassword(req.body.password, supportManager.password);

        if(!isPasswordMatch){
            supportManager.loggedIn.loginAttempts++;
            supportManager.save();
            return res.status(401).json({message: "Invalid password"});
        };

        supportManager.loggedIn.loginAttempts = 0;
        supportManager.authentication.otp = otp;
        supportManager.authentication.otpExpiry = otpExpiry;
        supportManager.authentication.token = token;
        await supportManager.save();

        const isMailSent = await sendMail({
            from: `No-reply <${process.env.MAIL_ID}>`,
            to: email,
            subject: "Support manager Logged in",
            html: `<h1>Support manager login OTP: ${otp}</h1>${Date().toLocaleString()}`,
        });

        if(!isMailSent){
            return res.status(500).json({message: "Unable to send OTP."});
        };

        const jwtToken = generateToken({
            id: supportManager._id,
            token,
            createdAt: Date.now(),
        })

        return res.status(201).cookie("supportManagerOtp",jwtToken,{
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 5,
            signed: true,
        }).json({message: "OTP sent to your email."});

    } catch (error) {
        next(error);
    };
};

export const loginVerifyOtp = async ( req , res , next ) => {
    try {
        const branchManagerOtp = req.signedCookies.supportManagerOtp;
        if(!branchManagerOtp){
            return res.status(401).json({message: "Unauthorized access."});
        };
        
        const decoded = verifyToken(branchManagerOtp);
        
        if(!decoded){
            return res.status(401).json({message: "Unauthorized access."});
        };
        
        const supportManager = await Modules.supportManager.findById(decoded.id);
        
        if(!supportManager){
            return res.status(404).json({message: "Officer not found"});
        };
        
        if(supportManager.authentication.token !== decoded.token){
            return res.status(401).json({message: "Unauthorized access."});
        };
        
        if(supportManager.authentication.otpExpiry < Date.now()){
            return res.status(401).json({message: "OTP expired."});
        };
        
        const otp = req.body.otp;
        if(!otp){
            return res.status(400).json({message: "OTP is required."});
        };
        if(otp.length !== 6){
            return res.status(400).json({message: "Invalid OTP."});
        };

        if(parseInt(otp,10) !== supportManager.authentication.otp){
            return res.status(401).json({message: "Invalid OTP."});
        };

        const token = crypto.randomBytes(32).toString("hex");
        

        const jwtToken = generateToken({
            id: supportManager._id,
            token,
            createdAt: Date.now(),
        });

        
        supportManager.loggedIn.lastLoggedIn = Date.now();
        supportManager.loggedIn.token = token;
        supportManager.authentication.otp = null;
        supportManager.authentication.otpExpiry = null;
        supportManager.authentication.token = null;
        await supportManager.save();

        const isMailSent = await sendMail({
            from: `No-reply <${process.env.MAIL_ID}>`,
            to: supportManager.email,
            subject: "Support manager Logged in",
            html: `<h1>Support manager logged in at ${Date().toLocaleString()}</h1>`,
        });

        if(!isMailSent){
            return res.status(500).json({message: "Unable to send mail."});
        };

        return res.status(200).clearCookie("supportManagerOtp").cookie("supportManager",jwtToken,{
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
            signed: true,
        }).json({message: "Logged in."});
        
    } catch (error) {
        next(error);
    };
};