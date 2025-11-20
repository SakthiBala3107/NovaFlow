import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  unitPrice: { type: String, required: true },
  taxPercent: { type: String, default: "0" },
  total: { type: String, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date },

    billFrom: {
      businessName: String,
      email: String,
      address: String,
      phone: String,
    },

    billTo: {
      clientName: String,
      email: String,
      address: String,
      phone: String,
    },

    items: [itemSchema],

    notes: { type: String },

    paymentTerms: { type: String, default: "Net 15" },

    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },

    subtotal: Number,
    taxTotal: Number,
    total: Number,
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
