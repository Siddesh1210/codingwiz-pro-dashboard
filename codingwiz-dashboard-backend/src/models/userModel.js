import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {  // Use user_id as _id
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Generate ObjectId
        unique: true,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    otp : {
        type: Number,
    },
    name : {
        type: String,
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
}, {timestamps: true})

export default mongoose.model("User", userSchema);

