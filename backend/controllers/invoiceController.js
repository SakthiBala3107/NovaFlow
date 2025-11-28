import Invoice from "../models/Invoice.model.js";

export const createInvoice = async (req, res) => {
  try {
    const user = req.user;
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
    } = req.body;

    console.log("Invoice payload received:", req.body);

    // subTotal & taxTotal calculation
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const tax = Number(item.taxPercent) || 0;

      const itemTotal = qty * price;
      subtotal += itemTotal;
      taxTotal += itemTotal * (tax / 100);
    });

    const total = subtotal + taxTotal;

    // create Invoice
    const invoice = new Invoice({
      user,
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      subtotal,
      taxTotal,
      total,
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error Creating Invoice:", error);
    res.status(500).json({ message: "Failed to create invoice", error });
  }
};

//
// export const getInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find().populate("user", "name email");
//     res.json(invoices);

//     //
//   } catch (error) {
//     console.error("Error getting Invoices", error);
//   }
// };

//

// GET /api/invoices?cursor=<lastId>&limit=10

export const getInvoices = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor;

    const query = {};

    // If cursor exists, fetch items AFTER this cursor
    if (cursor) {
      query._id = { $gt: cursor };
    }

    const invoices = await Invoice.find(query)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .populate("user", "name email");

    let next = null;

    if (invoices.length > limit) {
      next = invoices[invoices.length - 1]._id;
      invoices.pop();
    }

    // build next + previous URLs
    const baseUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl.split("?")[0]
    }`;

    //
    res.set("Cache-Control", "no-store");

    //
    res.json({
      next: next ? `${baseUrl}?cursor=${next}&limit=${limit}` : null,
      previous: cursor ? `${baseUrl}?before=${cursor}&limit=${limit}` : null,
      results: invoices,
    });
  } catch (error) {
    console.error("Error getting invoices", error);
    res.status(500).json({ error: "Server error" });
  }
};

//
export const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id).populate("user", "name email");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    if (invoice.user?._id.toString() !== req.user.id)
      return res.status(401).json({ message: "Not Authurized" });

    res.status(200).json(invoice);

    //
  } catch (error) {
    console.error("Error getting Invoice", error);
  }
};

export const updateInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      status,
    } = req.body;

    // Update fields if provided
    invoice.invoiceNumber = invoiceNumber || invoice.invoiceNumber;
    invoice.invoiceDate = invoiceDate || invoice.invoiceDate;
    invoice.dueDate = dueDate || invoice.dueDate;
    invoice.billFrom = billFrom || invoice.billFrom;
    invoice.billTo = billTo || invoice.billTo;
    invoice.notes = notes || invoice.notes;
    invoice.paymentTerms = paymentTerms || invoice.paymentTerms;
    invoice.status = status || invoice.status;

    if (items) {
      // Recalculate subtotal, taxTotal, total
      let subtotal = 0;
      let taxtotal = 0;

      items.forEach((item) => {
        subtotal += item.unitPrice * item.quantity;
        taxtotal +=
          (item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
      });

      const total = subtotal + taxtotal;

      invoice.items = items;
      invoice.subtotal = subtotal;
      invoice.taxTotal = taxtotal;
      invoice.total = total;
    }

    const updatedInvoice = await invoice.save();
    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Error updating Invoice", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete an existing invoice
export const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await invoice.deleteOne();
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting Invoice", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
