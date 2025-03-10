import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import dbConfig from './config/dbConfig.js';
import utilRouter from './routes/utilRouter.js';
import userRouter from './routes/userRouter.js';
import couponRouter from './routes/couponRouter.js';
import apikeyRouter from './routes/apikeyRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { port } from './config/envConfig.js';
import customerRouter from './routes/customerRouter.js';
import transactionRouter from './routes/transactionRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://codingwiz-dashboard-by-siddesh-jaiswal.vercel.app"];
//Handling Cors Issue
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Allows cookies and authentication headers
}));

//Express Middleware for parsing JSON request bodies
app.use(express.json());

//CookieParser Middleware for parsing cookies
app.use(cookieParser())

//Env Variables configuration
dotenv.config();

// DB Connection
(async () => {
    await dbConfig()
})()

//Sample Test API
app.get("/", (req, res) => {
    res.status(200).send({message : "App is runing!!!"})
})

// All utils API
app.use('/api/v1/auth', utilRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/coupon', couponRouter);
app.use('/api/v1/api-key', apikeyRouter);
app.use('/api/v1/customer', customerRouter);
app.use('/api/v1/transaction', transactionRouter);
app.use('/api/v1/dashboard', dashboardRouter);

app.use(errorHandler)


//Server Creation
app.listen(port || 3000, ()=> {
    console.log(`Server is running on port ${port || 3000}`);
})