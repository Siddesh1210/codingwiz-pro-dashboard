import Coupon from '../../src/models/couponModel.js'

export const couponList = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const couponDetail = await Coupon.find({user_id});
        if (couponDetail.length === 0) {
            return res.status(200).json({ message: "No coupons found", data: [] });
        }
        
        res.status(200).json({ message: "Coupons retrieved", data: couponDetail });
    } catch (error) {
        next(error);
    }
}

export const createCoupon = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const { coupon_code, discount_type, discount_value, usage_limit, min_order, start_date, end_date } = req.body;
        const couponCreated = await Coupon.create({
            user_id,
            coupon_code,
            discount_type,
            discount_value,
            usage_limit,
            min_order,
            start_date,
            end_date
        })
        
        if(!couponCreated) {
            return res.status(400).json({ message: "Failed to create coupon" });
        }
        
        res.status(201).json({ message: "Coupon created successfully", data: couponCreated });
    } catch (error) {
        next(error);   
    }
}

export const deleteCoupon = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const { coupon_id } = req.body;
        const couponDeleted = await Coupon.deleteOne({ user_id, coupon_id });
        if (couponDeleted.deletedCount === 0) {
            return res.status(404).json({ message: "Coupon not found or already deleted" });
        }

        res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
        next(error);   
    }
}
