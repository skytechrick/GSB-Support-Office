import z from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const createNewSellerSchema = z.object({
    id: z.string(),
    personalDetails: z.object({
        name: z.string(),
        age: z.string().min(2).max(2),
        mobileNumber: z.string().min(10).max(10),
        altMobileNumber: z.string().min(10).max(10),
        gender: z.string().min(4).max(6),
    }),
    shopName: z.string(),
    shopAddress: z.string().url(),
    shopCategory: z.string(),
    shopContact: z.string().min(10).max(10),
    bankAccount: z.object({
        bankName: z.string(),
        benificiaryName: z.string(),
        accountNumber: z.string(),
        ifscCode: z.string()
    }),
    documents: z.object({
        panId: z.string(),
        aadhaarId: z.string() 
    }),
    email: z.string().email(),
    address: z.object({
        address: z.string().min(4).max(255),
        pinCode: z.string().max(6).min(6),
        city: z.string().min(4).max(255),
        state: z.string().min(4).max(255),
        country: z.string().min(4).max(255),
    }),
});

export const createNewSupportManagerSchema = z.object({
    id: z.string(),
    personalDetails: z.object({
        name: z.string(),
        age: z.string().min(2).max(2),
        mobileNumber: z.string().min(10).max(10),
        altMobileNumber: z.string().min(10).max(10),
        gender: z.string().min(4).max(6),
    }),
    bankAccount: z.object({
        bankName: z.string(),
        benificiaryName: z.string(),
        accountNumber: z.string(),
        ifscCode: z.string()
    }),
    documents: z.object({
        panId: z.string(),
        aadhaarId: z.string() 
    }),
    email: z.string().email(),
    address: z.object({
        address: z.string().min(4).max(255),
        pinCode: z.string().max(6).min(6),
        city: z.string().min(4).max(255),
        state: z.string().min(4).max(255),
        country: z.string().min(4).max(255),
    }),
});

export const createNewDeliveryAgentSchema = z.object({
    id: z.string(),
    personalDetails: z.object({
        name: z.string(),
        age: z.string().min(2).max(2),
        mobileNumber: z.string().min(10).max(10),
        altMobileNumber: z.string().min(10).max(10),
        gender: z.string().min(4).max(6),
    }),
    bankAccount: z.object({
        bankName: z.string(),
        benificiaryName: z.string(),
        accountNumber: z.string(),
        ifscCode: z.string()
    }),
    documents: z.object({
        panId: z.string(),
        aadhaarId: z.string() 
    }),
    email: z.string().email(),
    address: z.object({
        address: z.string().min(4).max(255),
        pinCode: z.string().max(6).min(6),
        city: z.string().min(4).max(255),
        state: z.string().min(4).max(255),
        country: z.string().min(4).max(255),
    }),
});