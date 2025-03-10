import Transaction from "../models/transactionModel.js";

export const createTransaction = async (req, res, next) => {
    try {
        const {amount, customer_id, wallet_address, user_id } = req.body;
        const transaction = await Transaction.create({
            amount,
            wallet_address,
            user_id,
            customer_id
        })
        if(!transaction) {
            return res.status(400).send({ message: "Failed to create Transaction" });
        }
        res.status(201).send({ message: "Transaction created successfully", data: transaction });
    } catch (error) {
        next(error);
    }
}