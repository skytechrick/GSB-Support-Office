
import Models from '../models.js';


import { hashPassword } from '../utils/passwordController.js';

import { createNewSellerSchema } from '../utils/zodSchema.js';


export const createSeller = async ( req , res , next ) => {
    try {
        const manager = req.manager;

        const isValid = createNewSellerSchema.safeParse(req.body);

        if(!isValid.success){
            return res.status(400).json({message: "Invalid data"});
        };

        const foundSupportOffice = await Models.supportOffice.findOne({ _id: isValid.data.id });

        if(!foundSupportOffice){
            return res.status(404).json({message: "Support office not found"});
        };

        const foundSeller = await Models.seller.findOne({ email: isValid.data.email });

        if(foundSeller){
            return res.status(409).json({message: "Seller already exists"});
        };

        const secondSearch = await Models.seller.findOne({ "personalDetails.mobileNumber": isValid.data.personalDetails.mobileNumber });

        if(secondSearch){
            return res.status(409).json({message: "Seller already exists"});
        };

        const thirdSearch = await Models.seller.findOne({"documents.panId": isValid.data.documents.panId });

        if(thirdSearch){
            return res.status(409).json({message: "Seller already exists, panId already exists"});
        };

        const fourthSearch = await Models.seller.findOne({"documents.aadhaarId": isValid.data.documents.aadhaarId });

        if(fourthSearch){
            return res.status(409).json({message: "Seller already exists, aadhaarId already exists"});
        };


        const hashedPassword = await hashPassword(isValid.data.documents.aadhaarId);
        
        const newSellerObject = {
            supportOffice: foundSupportOffice._id,
            personalDetails: isValid.data.personalDetails,
            shopName: isValid.data.shopName,
            shopAddress: isValid.data.shopAddress,
            shopCategory: isValid.data.shopCategory,
            shopContact: isValid.data.shopContact,
            bankAccount: isValid.data.bankAccount,
            documents: isValid.data.documents,
            email: isValid.data.email,
            address: isValid.data.address,
            password: hashedPassword,
        };

        const newSeller = await Models.seller(newSellerObject);

        const createdSeller = await newSeller.save();

        const updateSupportOffice = await Models.supportOffice.findOneAndUpdate(manager.supportOffice._id,
            { $push: { sellers: createdSeller._id } },
        );

        return res.status(201).json({
            message: "Seller created successfully.",
            seller: createdSeller,
        });

    } catch (error) {
        next(error);
    };
};