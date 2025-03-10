import Customer from "../models/customerModel.js";

export const addCustomerDetails = async (req, res, next) => {
    try {
        const {name, address, phone, wallet_address, is_active, user_id } = req.body;
        const customer = await Customer.create({
            name,
            address,
            phone,
            wallet_address,
            is_active,
            user_id
        })
        if(!customer) {
            return res.status(400).send({ message: "Failed to add customer details" });
        }
        res.status(201).send({ message: "Customer details added successfully", data: customer });
    } catch (error) {
        next(error);
    }
}