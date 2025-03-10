import orderModel from "../models/orderModel.js";
import Transaction from "../models/transactionModel.js";
import mongoose from "mongoose";

export const uniqueUsers = async (req, res, next) => {
    try {
        const user_id = req.user_id; // Extract user_id from request
        let { page, limit, from_wallet_address } = req.query;
    
        // Convert page and limit to numbers (default to page=1 and limit=10)
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;
    
        // Aggregation pipeline
        const pipeline = [
            // Step 1: Filter transactions by user_id
            { $match: { user_id: new mongoose.Types.ObjectId(user_id) } }
        ];
    
        // Step 2: Optional filtering by from_wallet_address (customer_id)
        if (from_wallet_address) {
            pipeline.push({
                $match: { customer_id: new mongoose.Types.ObjectId(from_wallet_address) }
            });
        }
    
        // Step 3: Group transactions by customer_id
        pipeline.push(
            { $sort: { createdAt: 1 } },
            {
                $group: {
                    _id: "$customer_id",
                    from_wallet_address: { $first: "$customer_id" }, // Keep customer_id
                    total_transactions: { $sum: 1 }, // Count transactions
                    total_amount: { $sum: { $toDouble: "$amount" } }, // Convert and sum amount
                    first_transaction_date: { $first: "$createdAt" }, // Get first transaction date
                    last_transaction_date: { $last: "$createdAt" } // Get last transaction date
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }], // Count total records
                    data: [{ $skip: skip }, { $limit: limit }] // Pagination
                }
            }
        );
    
        const stats = await Transaction.aggregate(pipeline);
    
        const total = stats[0].metadata[0]?.total || 0;
        const transactions = stats[0].data;
    
        res.status(200).send({
            message: "Transaction stats fetched successfully",
            totalRecords: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            perPage: limit,
            data: transactions
        });
    
    } catch (error) {
        next(error.message)
    }
    
};

export const recentTransaction = async (req, res, next) => {
    try {
        const user_id = req.user_id; // Comes from authentication middleware
        const { order_id, limit = 10, page = 1, from_date, to_date, status } = req.query;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        // Build the match filter dynamically
        const matchStage = {};

        // Convert user_id to ObjectId for correct matching
        if (mongoose.Types.ObjectId.isValid(user_id)) {
            matchStage.user_id = new mongoose.Types.ObjectId(user_id);
        }


        // Ensure order_id is correctly filtered (as a string)
        if (order_id) {
            matchStage.order_id = order_id;
        }

        // Apply status filter if provided
        if (status) {
            matchStage.status = status;
        }

        // Handle `createdAt` filter for `from_date` and `to_date`
        if (from_date || to_date) {
            matchStage.createdAt = {};
            if (from_date) matchStage.createdAt.$gte = new Date(from_date);
            if (to_date) matchStage.createdAt.$lte = new Date(to_date);
        }

        console.log("Match Stage:", JSON.stringify(matchStage, null, 2)); // Debugging output

        // MongoDB Aggregation Query
        const transactions = await orderModel.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 } }, // Sort by newest transactions first
            { $skip: skip },
            { $limit: limitNum }
        ]);

        // const transactions = await orderModel.find({ user_id})

        // If no transactions found
        if (transactions.length === 0) {
            return res.status(200).send({ message: "No transactions found", data: [] });
        }

        res.status(200).send({ message: "Transactions fetched successfully", data: transactions });

    } catch (error) {
        console.error("Error fetching transactions:", error);
        next(error);
    }
};

export const graphData = async (req, res, next) => {
    try {
        const user_id = req.user_id;

        const pipeline = [
            {
                $match: { user_id: new mongoose.Types.ObjectId(user_id) } // Filter by user_id
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date (YYYY-MM-DD)
                    total_volume: { $sum: "$amount" }, // Sum of amounts
                    total_txs: { $sum: 1 } // Count total transactions
                }
            },
            {
                $project: {
                    _id: 0,
                    date: { $toDate: "$_id" }, // Convert string date back to Date object
                    total_volume: 1,
                    total_txs: 1
                }
            },
            {
                $sort: { date: -1 } // Sort by date (latest first)
            }
        ];

        const stats = await orderModel.aggregate(pipeline);

        res.status(200).send({
            message: "Order statistics fetched successfully",
            data: stats
        });

    } catch (error) {
        next(error.message);
    }
}

export const getStatsData = async (req, res, next) => {
    try {
        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const objectIdUserId = new mongoose.Types.ObjectId(user_id);
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);

        const stats = await orderModel.aggregate([
            {
                $match: { user_id: objectIdUserId }
            },
            {
                $facet: {
                    overallStats: [
                        {
                            $group: {
                                _id: null,
                                total_txs: { $sum: 1 },
                                total_volume: { $sum: "$amount" }
                            }
                        }
                    ],
                    volumeLastWeek: [
                        {
                            $match: { createdAt: { $gte: oneWeekAgo } }
                        },
                        {
                            $group: {
                                _id: null,
                                volume_1_week: { $sum: "$amount" }
                            }
                        }
                    ],
                    volumeToday: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(today.setHours(0, 0, 0, 0)), // Start of today
                                    $lt: new Date(today.setHours(23, 59, 59, 999)) // End of today
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                volume_today: { $sum: "$amount" }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    total_txs: { $ifNull: [{ $arrayElemAt: ["$overallStats.total_txs", 0] }, 0] },
                    total_volume: { $ifNull: [{ $arrayElemAt: ["$overallStats.total_volume", 0] }, 0] },
                    volume_1_week: { $ifNull: [{ $arrayElemAt: ["$volumeLastWeek.volume_1_week", 0] }, 0] },
                    volume_today: { $ifNull: [{ $arrayElemAt: ["$volumeToday.volume_today", 0] }, 0] }
                }
            }
        ]);

        res.status(200).json({ message: "Order stats fetched successfully", data: [stats[0]] });
    } catch (error) {
        next(error.message);
    }
}

