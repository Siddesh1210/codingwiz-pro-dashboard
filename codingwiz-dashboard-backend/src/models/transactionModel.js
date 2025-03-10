import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    amount: {
        type: String,
        required: true,
        unique: true
    },
    wallet_address: {
        type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    }
}, {timestamps: true});

export default mongoose.model("Transaction", transactionSchema);