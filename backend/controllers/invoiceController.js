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

    // subTotal Calculation
    let subtotal = 0;
    let taxtotal = 0;

    items.forEach((item) => {
      subtotal += item?.unitPrice * item?.Quantity;
      taxtotal += (subtotal * (item?.taxPercent || 0)) / 100;
    });

    const total = subtotal + taxtotal;

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
      taxtotal,
      total,
    });

    await invoice.save();
    res.status(201).json(invoice);

    //
  } catch (error) {
    console.error("Error Creating Invoice", error);
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("user", "name email");
    res.json(invoices);

    //
  } catch (error) {
    console.error("Error getting Invoices", error);
  }
};

export const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id).populate("user", "name email");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
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
