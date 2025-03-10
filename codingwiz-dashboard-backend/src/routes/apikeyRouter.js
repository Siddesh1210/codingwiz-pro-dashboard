import express from 'express';
import authUser from '../middlewares/authUser.js';
import { createApiKey, deleteApiKey, getApiKey } from '../controllers/apikeyController.js';
const router = express.Router();

//Create API Key
router.post("/", authUser, createApiKey)

//Get API Key
router.get("/", authUser, getApiKey)

//Delete API Key
router.delete("/", authUser, deleteApiKey)


export default router;