import express from 'express';
const supportOfficeRoute = express.Router();
export default supportOfficeRoute;

import { verifyManager } from '../utils/verifySupportManager.js';

import { createSeller , getAllSellers , createSupportAssistant , getAllSupporAssistants } from '../controllers/supportOfficeControllers.js';

const apiMiddleware = async (req, res, next) => {
    req.isApi = true;
    next();
};

supportOfficeRoute.use(apiMiddleware , verifyManager);

supportOfficeRoute.post("/seller/create" , createSeller );
supportOfficeRoute.post("/seller" , getAllSellers );

supportOfficeRoute.post("/assistant/create" , createSupportAssistant );
supportOfficeRoute.post("/assistant" , getAllSupporAssistants );