import express from 'express';
import authUser from '../middlewares/authUser.js';
import { userData, companyData, updateUserData, updateCompanyData, planDetail, trialPlan } from '../controllers/userController.js';
const router = express.Router();

//Get user Data
router.get("/", authUser, userData)

//Used to update User Data
router.put("/", authUser, updateUserData)

//Get company Data
router.get("/company", authUser, companyData)

//Used to update Company Data
router.put("/company", authUser, updateCompanyData)

//Get plan Detail
router.get("/plan-details", authUser, planDetail)

//Make Trial Plan 
router.post("/trial-plan", authUser, trialPlan)

export default router;