import express from 'express';
import { getStatsData, graphData, recentTransaction, uniqueUsers } from '../controllers/dashboardController.js';
import authUser from '../middlewares/authUser.js';
const router = express.Router();

router.get("/unique-users", authUser, uniqueUsers);

router.get("/recent-txs", authUser, recentTransaction);

router.get("/graph", authUser, graphData)

router.get("/stats", authUser, getStatsData)

export default router;