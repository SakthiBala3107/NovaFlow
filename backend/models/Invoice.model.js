import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  quantity: { type: Number, required: true, default: 0 },
  unitPrice: { type: Number, required: true, default: 0 },
  taxPercent: { type: Number, default: 0 },
  total: { type: Number, required: true, default: 0 }, // <-- default prevents NaN crash
});

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
    status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    subtotal: { type: Number, default: 0 }, // <-- default prevents NaN crash
    taxTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
