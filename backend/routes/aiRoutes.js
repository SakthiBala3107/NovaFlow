import { Router } from "express";
import AuthMiddleWare from "../middlewares/authMiddlewares.js";
import {
  generateReminderEmail,
  getDashboardSummary,
  parseInvoiceFromText,
} from "../controllers/aiController.js";

const AI_Router = Router();

AI_Router.post("/parse-text", AuthMiddleWare, parseInvoiceFromText);
AI_Router.post("/generate-reminder", AuthMiddleWare, generateReminderEmail);
AI_Router.get("/dashboard-summary", AuthMiddleWare, getDashboardSummary);

export default AI_Router;
