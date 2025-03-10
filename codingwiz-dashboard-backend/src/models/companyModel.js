import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    _id: {  // Use user_id as _id
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Generate ObjectId
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    support_email: {
        type: String,
    },
    mobile: {
        type: String,
        required: true
    },
    support_mobile: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    website: {
        type: String,
    },
    company_identification_no: {
        type: String,
        required: true
    },
    user_id: {  // Now correctly references User's _id
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

export default mongoose.model("Company", companySchema);