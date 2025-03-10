import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from "../../src/models/userModel.js";
import { generateSecureOTP, sendEmailToUser } from '../utils/utilsMethods.js';
import Order from '../../src/models/orderModel.js';
import { RAZORPAY_KEY_ID, RAZORPAY_SECRET, NODE_ENV } from '../config/envConfig.js';

export const login = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = generateSecureOTP();
        let info = await sendEmailToUser(email, otp);
        let user = await User.findOne({email});
        if(!user) {
            user = await User.create( {
                email,
                otp,
            })
        } else {
            user.otp = otp;
            await user.save();
        }
        res.json({ message: 'OTP sent successfully', messageId: info.messageId, user });
    } catch (error) {
        next(error);;
    }
}

export const resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = generateSecureOTP();
        const info = await sendEmailToUser(email, otp);
        let user = await User.findOne({email});
        if(!user) {
            user = await User.create( {
                email,
                otp
            })
        } else {
            user.otp = otp;
            await user.save();
        }
    
        res.status(200).send({ message: "OTP Resent Successfully", messageId: info.messageId , user})
    } catch (error) {
        next(error);;
    }
}

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email}); 
        if(!user) {
            return res.status(404).send({ message: "User not found with given email" })
        }
        const isMatch = user.otp == otp;
        if(!isMatch) {
            return res.status(401).send({ message: "Invalid OTP" })
        } 
        user.otp = undefined;
        await user.save();

        // const default_userId = user.user_id;
        // console.log("User id is: ", default_userId);
        const default_userId = "67c3077613a7e7f99a97ef3b";

    
        if (!req.cookies.user_id) {
            res.cookie("user_id", default_userId, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production",  // ✅ Ensures HTTPS in production
                sameSite: "None",  // ✅ Allows cross-origin cookies
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
        }
    
        res.status(200).send( {message: "OTP verified successfully", data: {user_id: user.user_id}})
    } catch (error) {
        next(error);;
    }
}


export const order = async (req, res, next) => {
    try {
        const razorpay = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_SECRET
        })
    
        const options = req.body;
        const order = await razorpay.orders.create(options);
        console.log("Order is: ", order);
        if(!order) {
            res.status(500).send( {message: "Order not created" });
        }
        res.status(200).send( {message: "Order created successfully", data: order })
    } catch (error) {
        next(error);;
    }
}

export const validateOrder = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, razorpay_amount, razorpay_payment_status, tier, startDate, endDate } = req.body;

        //Validating payment
        const sha = crypto.createHmac("sha256", RAZORPAY_SECRET);
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest("hex");
        if(digest!== razorpay_signature) {
            return res.status(401).send({ message: "Payment is Invalid" });
        }

        //Creating Order
        const orderCreated = await Order.create({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            amount: razorpay_amount,
            status: razorpay_payment_status,
            user_id: req.user_id,
            tier: tier,
            start_date: startDate,
            end_date: endDate,
        })
        

        return res.status(200).send({ message: "Payment is Valid" , data: orderCreated });
    } catch (error) {
        next(error);;
    }
}

export const failedOrder = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_amount, razorpay_payment_status, tier, startDate, endDate } = req.body;

        //Creating Order
        const orderCreated = await Order.create({
            order_id: razorpay_order_id,
            payment_id: "xxxxxxx",
            amount: razorpay_amount,
            status: razorpay_payment_status,
            user_id: req.user_id,
            tier: tier,
            start_date: startDate,
            end_date: endDate,
        })

        return res.status(200).send({ message: "Failed Order is successfully inserted" , data: orderCreated });
    } catch (error) {
        next(error);;
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("user_id", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        });
        res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
        next(error.message);   
    }
}