import express from 'express';
import authUser from '../middlewares/authUser.js';
import { login, resendOTP, verifyOTP, order, validateOrder, failedOrder, logout } from '../controllers/utilController.js';
const router = express.Router();

//Send OTP API on Login
router.post("/login", login);

//Resend OTP API on Login
router.post("/resendotp", resendOTP);

//Verify OTP API
router.post("/verify", verifyOTP);

//Make Order API
router.post("/order", authUser, order);

//Validate Order API
router.post("/validate-order", authUser, validateOrder);

//Failed Order API
router.post("/failed-order", authUser, failedOrder);

router.post("/logout", authUser, logout);

export default router;