import express from 'express';
const supportOfficeRoute = express.Router();
export default supportOfficeRoute;

import { verifyManager } from '../utils/verifySupportManager.js';

import { createSeller } from '../controllers/supportOfficeControllers.js';

const apiMiddleware = async (req, res, next) => {
    req.isApi = true;
    next();
};

supportOfficeRoute.use(apiMiddleware , verifyManager);

supportOfficeRoute.post("/seller/create" , createSeller );
