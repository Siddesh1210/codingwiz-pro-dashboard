import express from 'express';
import { addCustomerDetails } from '../controllers/customerController.js';
const router = express.Router();

router.post("/", addCustomerDetails);

export default router;