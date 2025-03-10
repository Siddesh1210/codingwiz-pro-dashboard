import { generateSecureSecretKey } from '../utils/utilsMethods.js';
import ApiKey from '../../src/models/apikeyModel.js';
import orderModel from '../../src/models/orderModel.js';

export const createApiKey = async (req, res, next) => {
    try {
        const {api_key} = req.body;
    
        const getISTDate = (date) => {
            let istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
            return new Date(date.getTime() + istOffset);
        };
        
        // Get today's date in IST
        const startDate = (new Date());
        
        // Calculate end date (20 days later in IST)
        const endDate = (new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000));
    
        const latestOrder = await orderModel
                                            .find({ user_id: req.user_id })
                                            .sort({ tier: -1, end_date: -1, createdAt: -1 }) 
                                            .limit(1); 
        const tier = latestOrder.length > 0 ? latestOrder[0].tier : null;
        const apiKey = await ApiKey.create({
            api_key,
            user_id: req.user_id,
            api_created_on: startDate,
            api_expiry: endDate,
            tier,
            api_secret: generateSecureSecretKey(),
            isactive: true
        })
    
        if(!apiKey) {
            return res.status(500).send({ message: "Failed to create API key" });
        }
        
        res.status(201).send({ message: "API key created successfully", data: apiKey });
    } catch (error) {
        next(error);
    }
}

export const getApiKey = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const apiKey = await ApiKey.findOne({user_id});
        res.status(200).send({ message: "API key details", data: apiKey || [] });
    } catch (error) {
        next(error);
    }
}

export const deleteApiKey = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const apiKey = await ApiKey.findOneAndDelete({ user_id });
        if(!apiKey) {
            return res.status(404).send({ message: "API key not found" });
        }
        res.status(200).send({ message: "API key deleted successfully" });
    } catch (error) {
        next(error);
    }
}