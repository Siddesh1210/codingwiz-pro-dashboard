import User from '../../src/models/userModel.js';
import Company from '../../src/models/companyModel.js';
import Order from '../../src/models/orderModel.js';
import { generateSecureOrderId } from '../utils/utilsMethods.js';

export const userData = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        if(!user_id) {
            return res.status(401).send({ message: "Unauthorized, user_id missing" });
        }
    
        const userDetail = await User.findOne({user_id});
        if(!userDetail) {
            return res.status(404).send({ message: "User not found with given user_id" });
        }
        return res.status(200).send({message: "User data fetched successfully", data: userDetail})
    } catch (error) {
        next(error);
    }
}

export const updateUserData = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        if (!user_id) {
            return res.status(401).send({ message: "Unauthorized, user_id missing" });
        }
        const {name} = req.body;
        const user = await User.findOne({user_id});
        if(!user) {
            return res.status(404).send({ message: "User Detail not found with given user_id" });
        }
        user.name = name;
        await user.save();
        res.status(200).send({message: "User detail updated successfully", data: {user_id: user.user_id}})
    } catch (error) {
        next(error);
    }
}

export const companyData = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        if(!user_id) {
            return res.status(401).send({ message: "Unauthorized, user_id missing" });
        }
    
        const companyDetail = await Company.findOne({user_id});
        if(!companyDetail) {
            return res.status(404).send({ message: "Company Detail not found with given user_id" });
        }
        return res.status(200).send({message: "Company data fetched successfully", data: companyDetail})
    } catch (error) {
        next(error);
    }
}

export const updateCompanyData = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        if (!user_id) {
            return res.status(401).send({ message: "Unauthorized, user_id missing" });
        }
        const {address, company_identification_no, email, mobile, name, support_email, support_mobile, website} = req.body;
        const user = await User.findOne({user_id});
        if(!user) {
            return res.status(404).send({ message: "User not found with given user_id" });
        }

        const company = await Company.findOneAndUpdate(
            { user_id }, // Search criteria (find company by user_id)
            {
                name,
                address,
                email,
                mobile,
                support_email,
                support_mobile,
                website,
                company_identification_no
            },
            { 
                new: true,   // Return the updated document
                upsert: true // Insert if not exists
            }
        );
        
        console.log("Company Data:", company);
        

        res.status(200).send({message: "Company detail updated successfully", data: {company}})
    } catch (error) {
        next(error);
    }
}

export const planDetail = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const planDetail = await Order
                                    .find({ user_id })
                                    .sort({ tier: -1, end_date: -1, createdAt: -1 }) // Sort by highest tier, latest end_date, latest createdAt

        if(planDetail.length == 0) {
            return res.status(200).send({ message: "No subscription plan found for the user", data: []});
        }
        return res.status(200).send({message: "Subscription plan details fetched successfully", data: planDetail})
    } catch (error) {
        next(error);
    }
}

export const trialPlan = async (req, res, next) => {
    try {
        const getISTDate = (date) => {
            let istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
            return new Date(date.getTime() + istOffset);
        };
        
        // Get today's date in IST
        const startDate = (new Date());
        
        // Calculate end date (20 days later in IST)
        const endDate = (new Date(startDate.getTime() + 20 * 24 * 60 * 60 * 1000));
        
        // Store in database (ISO format)
        const orderCreated = await Order.create({
            order_id: generateSecureOrderId(),
            payment_id: "FREE_KTUSP_123",
            amount: 0,
            status: "completed",
            user_id: req.user_id,
            tier: 0,
            start_date: startDate,
            end_date: endDate,
        });
        
        if (!orderCreated) {
            return res.status(500).send({ message: "Failed to create trial plan" });
        }
        return res.status(200).send({ message: "Trial plan created successfully", data: orderCreated });
        
    } catch (error) {
        next(error);
    }
}

