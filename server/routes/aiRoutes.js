import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from "../controllers/aiController.js";


const aiRouter = express.Router();

aiRouter.post('/enhanc-pro-sum', protect, enhanceProfessionalSummary)
aiRouter.post('/enhanc-job-sum', protect, enhanceJobDescription)
aiRouter.post('/upload-resume', protect, uploadResume)

export default aiRouter