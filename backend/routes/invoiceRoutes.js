import { Router } from "express";
import AuthMiddleWare from "../middlewares/authMiddlewares.js";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
} from "../controllers/invoiceController.js";

const invoiceRouter = Router();

invoiceRouter
  .route("/")
  .post(AuthMiddleWare, createInvoice)
  .get(AuthMiddleWare, getInvoices);

invoiceRouter
  .route("/:id")
  .get(AuthMiddleWare, getInvoiceById)
  .put(AuthMiddleWare, updateInvoice)
  .delete(AuthMiddleWare, deleteInvoice);

export default invoiceRouter;
