import mongoose from "mongoose";

const apikeySchema = new mongoose.Schema({
    api_key: {
        type: String,
        required: true,
        unique: true
    },
    api_created_on: {
        type: Date,
        default: Date.now()
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    api_expiry: {
        type: Date,
        required: true,
    },
    api_secret: {
        type: String,
        required: true,
        unique: true
    },
    tier: {
        type: String,
        required: true,
        enum: ["0", "1", "2"]
    },
    isactive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {timestamps: true});

export default mongoose.model("ApiKey", apikeySchema);