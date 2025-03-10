import express from 'express';
import authUser from '../middlewares/authUser.js';
import { couponList, createCoupon, deleteCoupon } from '../controllers/couponController.js';
const router = express.Router();

//Get list of coupon
router.get('/coupon-list', authUser, couponList)

//Create a coupon
router.post("/create", authUser, createCoupon)

//Delete a coupon
router.delete("/", authUser, deleteCoupon)

export default router;