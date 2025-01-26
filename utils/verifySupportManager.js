import Modules from "../models.js";
import { verifyToken } from "./jwtController.js";


export const verifyManager = async ( req , res , next ) => {
    try {
        const token = req.signedCookies.supportManager;
        
        if(!token){
            return res.status(401).json({message: "Unauthorized access."});
        };

        const decoded = verifyToken(token);

        if(!decoded){
            return res.status(401).json({message: "Unauthorized access."});
        };

        const manager = await Modules.supportManager.findById(decoded.id).populate("supportOffice").exec();

        if(!manager){
            return res.status(404).json({message: "Manager not found"});
        };

        if(manager.loggedIn.token !== decoded.token){
            return res.status(401).json({message: "Unauthorized access."});
        };
        if(manager.isBan){
            return res.status(401).json({message: "Unauthorized access."});
        };

        // if(!officer.isVerified){
        //     return res.status(401).json({message: "Unauthorized access."});
        // };

        req.manager = manager;
        next();
        
    } catch ( error ) {
        next(error);
    };
};