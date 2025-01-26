
import Models from '../models.js';


import { hashPassword } from '../utils/passwordController.js';

import { createNewSellerSchema , createNewSupportManagerSchema } from '../utils/zodSchema.js';


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

export const getAllSellers = async ( req , res , next ) => {
    try {
        const manager = req.manager;

        const allSellers = await Models.seller.find({ supportOffice: manager.supportOffice._id });

        return res.status(200).json({
            message: "All sellers",
            totalSellers: allSellers.length,
            sellers: allSellers,
            allShopNames: allSellers.map((seller) => seller.shopName),
        });

    } catch (error) {
        next(error);
    };
};

// ____________________________________________________________________________________
// ____________________________________________________________________________________
// ____________________________________________________________________________________
// ____________________________________________________________________________________
// ____________________________________________________________________________________

export const createSupportAssistant = async ( req , res , next ) => {
    try {

        const manager = req.manager;

        const isValid = createNewSupportManagerSchema.safeParse(req.body);

        if(!isValid.success){
            return res.status(400).json({message: "Invalid data"});
        };

        const foundSupportOffice = await Models.supportOffice.findOne({ _id: isValid.data.id });

        if(!foundSupportOffice){
            return res.status(404).json({message: "Support office not found"});
        };

        const foundAssistant = await Models.supportAssistant.findOne({ email: isValid.data.email });

        if(foundAssistant){
            return res.status(409).json({message: "Assistant already exists"});
        };

        const secondSearch = await Models.supportAssistant.findOne({ "personalDetails.mobileNumber": isValid.data.personalDetails.mobileNumber });

        if(secondSearch){
            return res.status(409).json({message: "Assistant already exists"});
        };

        const thirdSearch = await Models.supportAssistant.findOne({"documents.panId": isValid.data.documents.panId });

        if(thirdSearch){
            return res.status(409).json({message: "Assistant already exists, panId already exists"});
        };

        const fourthSearch = await Models.supportAssistant.findOne({"documents.aadhaarId": isValid.data.documents.aadhaarId });

        if(fourthSearch){
            return res.status(409).json({message: "Assistant already exists, aadhaarId already exists"});
        };

        const hashedPassword = await hashPassword(isValid.data.documents.aadhaarId);
        
        const newAssistantObject = {
            supportOffice: foundSupportOffice._id,
            personalDetails: isValid.data.personalDetails,
            bankAccount: isValid.data.bankAccount,
            email: isValid.data.email,
            address: isValid.data.address,
            password: hashedPassword,
            documents: isValid.data.documents,
        };

        const newAssistant = await Models.supportAssistant(newAssistantObject);

        const createdAssistant = await newAssistant.save();

        const updateSupportOffice = await Models.supportOffice.findOneAndUpdate(manager.supportOffice._id,
            { $push: { supportAssistants: createdAssistant._id } },
        );

        return res.status(201).json({
            message: "Assistant created successfully.",
            assistant: createdAssistant,
        });

    } catch (error) {
        next(error);
    };
};


export const getAllSupporAssistants = async ( req , res , next ) => {
    try {
        const manager = req.manager;

        const allAssistants = await Models.supportAssistant.find({ supportOffice: manager.supportOffice._id });

        return res.status(200).json({
            message: "All assistants",
            totalAssistants: allAssistants.length,
            assistants: allAssistants,
            names: allAssistants.map((assistant) => assistant.personalDetails.name),
        });

    } catch (error) {
        next(error);
    };
};