import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tier: {
        type: String,
    },
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {timestamps: true});

export default mongoose.model('Order', OrderSchema);