import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT;
export const email = process.env.email;
export const emailPassKey = process.env.emailPassKey;
export const mongodbURI = process.env.mongodbURI;
export const dbName = process.env.dbName;
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;
export const NODE_ENV = process.env.NODE_ENV;