import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    coupon_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Generate ObjectId
        unique: true,
        required: true
    },
    coupon_code: {
        type: String,
        required: true,
    },
    discount_type: {
        type: Number,
        required: true,
        enum: [0, 1, 2]
    },
    discount_value: {
        type: String,
        required: true,
    },
    usage_limit: {
        type: Number,
        required: true,
    },
    used_count: {
        type: Number,
        required: true,
        default: 0
    },
    min_order: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

export default mongoose.model('Coupon', couponSchema);