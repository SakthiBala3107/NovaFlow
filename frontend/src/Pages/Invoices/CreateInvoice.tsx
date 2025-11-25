import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
// import { Plus, Trash2 } from "lucide-react"
// import toast from "react-hot-toast"
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import TextAreaField from "../../components/ui/TextAreaField";
import { Plus, Trash2 } from "lucide-react";
import SelectedField from "../../components/ui/SelectedField";
import type { AIInvoiceItem, AIInvoiceData, CreateInvoiceProps, InvoicePayload, InvoiceType } from "../../types/data.types";
import { useCreateInvoice } from "../../hooks/UseQueries";
import toast from "react-hot-toast";


// onSave
const CreateInvoice: React.FC<CreateInvoiceProps> = ({ existingInvoice }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { mutate: createInvoice } = useCreateInvoice();

    ;

    const [formData, setFormData] = useState<InvoicePayload>(
        (existingInvoice as InvoicePayload) || {
            invoiceNumber: "",
            invoiceDate: new Date().toISOString().split("T")[0],
            dueDate: "",
            billFrom: {
                businessName: user?.businessName || "",
                email: user?.email || "",
                address: user?.address || "",
                phone: user?.phone || "",
            },
            billTo: { clientName: "", email: "", address: "", phone: "" },
            items: [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
            notes: "",
            paymentTerms: "Net 15",
        }
    );

    const [isGeneratingNumber, setIsGeneratingNumber] = useState<boolean>(
        !existingInvoice
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const aiData = (location.state as AIInvoiceData)?.aiData;

        // 1) Apply AI data
        if (aiData) {
            queueMicrotask(() => {
                setFormData((prev) => ({
                    ...prev,
                    billTo: {
                        clientName: aiData.clientName || "",
                        email: aiData.email || "",
                        address: aiData.address || "",
                        phone: "",
                    },
                    items:
                        aiData.items?.map((it: AIInvoiceItem) => ({
                            name: it?.name || "",
                            quantity: Number(it?.quantity) || 1,
                            unitPrice: Number(it?.unitPrice) || 0,
                            taxPercent: Number(it?.taxPercent) || 0,
                        })) || [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
                }));
            });
        }

        // 2) Existing invoice (MUST be a plain object)
        if (existingInvoice && typeof existingInvoice === "object" && !Array.isArray(existingInvoice)) {
            const inv = existingInvoice as InvoiceType;

            queueMicrotask(() => {
                setFormData({
                    ...(inv as unknown as InvoicePayload),
                    invoiceDate: moment(inv.invoiceDate).format("YYYY-MM-DD"),
                    dueDate: moment(inv.dueDate).format("YYYY-MM-DD"),
                });
            });

            return;
        }

        // 3) Generate new number
        const generateNewInvoiceNumber = async () => {
            setIsGeneratingNumber(true);

            try {
                const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
                const invoices = response?.data || [];

                let maxNum = 0;
                invoices.forEach((inv: InvoicePayload) => {
                    const parts = String(inv?.invoiceNumber || "").split("-");
                    const num = parseInt(parts[1]);
                    if (!isNaN(num) && num > maxNum) maxNum = num;
                });

                const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;

                queueMicrotask(() => {
                    setFormData((prev) => ({
                        ...prev,
                        invoiceNumber: newInvoiceNumber,
                    }));
                });
            } catch (err) {
                console.error("Failed to generate invoice number", err);

                queueMicrotask(() => {
                    setFormData((prev) => ({
                        ...prev,
                        invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
                    }));
                });
            }

            setIsGeneratingNumber(false);
        };

        generateNewInvoiceNumber();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingInvoice]);

    // handlers
    // handlers
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        section?: "billFrom" | "billTo" | null,
        index?: number | null
    ) => {
        const { name, value } = e.target;
        const numericNames = new Set(["quantity", "unitPrice", "taxPercent"]);

        const sanitizedValue = numericNames.has(name) ? Number(value) || 0 : value;

        if (section) {
            setFormData((prev) => ({
                ...prev,
                [section]: { ...(prev as InvoicePayload)[section], [name]: sanitizedValue },
            }));
            return;
        }

        if (typeof index === "number") {
            const newItems = [...(formData.items || [])];
            newItems[index] = { ...newItems[index], [name]: sanitizedValue };
            setFormData((prev) => ({ ...prev, items: newItems }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    };



    const handleAdditem = () => {
        // FIXED keys: quantity & taxPercent
        setFormData((prev) => ({
            ...prev,
            items: [
                ...(prev.items || []),
                { name: "", quantity: 1, unitPrice: 0, taxPercent: 0, total: 0 },
            ],
        }));
    };

    const handleRemoveItem = (index: number) => {
        const newItems = (formData?.items || []).filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    // memoized totals so they re-calc when items change
    const { subtotal, taxTotal, total } = useMemo(() => {
        let subtotal = 0;
        let taxTotal = 0;

        (formData.items || []).forEach((item) => {
            const qty = Number(item?.quantity) || 0;
            const price = Number(item?.unitPrice) || 0;
            const tax = Number(item?.taxPercent) || 0;

            const itemTotal = qty * price;
            subtotal += itemTotal;
            taxTotal += itemTotal * (tax / 100);
        });

        return {
            subtotal,
            taxTotal,
            total: subtotal + taxTotal,
        };
    }, [formData.items]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1️⃣ sanitize items
            const sanitizedItems = (formData.items || []).map((item) => {
                const quantity = Number(item.quantity) || 0;
                const unitPrice = Number(item.unitPrice) || 0;
                const taxPercent = Number(item.taxPercent) || 0;

                const total = quantity * unitPrice * (1 + taxPercent / 100);

                return {
                    ...item,
                    quantity,
                    unitPrice,
                    taxPercent,
                    total: isNaN(total) ? 0 : total,
                };
            });

            // 2️⃣ calculate totals safely
            const subtotal = sanitizedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
            const taxTotal = sanitizedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice * (item.taxPercent / 100), 0);
            const total = subtotal + taxTotal;

            // 3️⃣ build payload
            const payload: InvoicePayload = {
                ...formData,
                items: sanitizedItems,
                subtotal: isNaN(subtotal) ? 0 : subtotal,
                taxTotal: isNaN(taxTotal) ? 0 : taxTotal,
                total: isNaN(total) ? 0 : total,
            };

            // 4️⃣ send to backend
            createInvoice(payload, {
                onSuccess: () => {
                    setIsLoading(false);
                    toast.success("Invoice Created Successfully");
                    navigate("/invoices");
                },
                onError: (err) => {
                    setIsLoading(false);
                    toast.error("Failed to create Invoice");
                    console.error(err);
                },
            });
        } catch (err) {
            setIsLoading(false);
            toast.error("Something went wrong!");
            console.error(err);
        }
    };





    // UI total per item (display)
    const formatNumber = (v?: number) => {
        const n = Number(v) || 0;
        return n.toFixed(2);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-[100vh]">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-900">
                    {existingInvoice ? "Edit Invoice" : "Create Invoice"}
                </h2>
                <Button type="submit" isLoading={isLoading || isGeneratingNumber}>
                    {existingInvoice ? "Save Changes" : "Save Invoice"}
                </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200">
                <div className=" grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                        label="Invoice Number"
                        name="invoiceNumber"
                        readOnly
                        value={formData?.invoiceNumber}
                        placeholder={isGeneratingNumber ? "Generating..." : ""}
                        disabled
                    />
                    <InputField
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, null)}
                        label="InvoiceDate"
                        type="date"
                        name="invoiceDate"
                        value={formData?.invoiceDate}
                    />

                    <InputField
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, null)}
                        label="dueDate"
                        type="date"
                        name="dueDate"
                        value={formData?.dueDate ?? ""}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4 ">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Bill From</h3>
                    <InputField
                        label="Business Name"
                        name="businessName"
                        value={formData?.billFrom?.businessName}
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, "billFrom")}
                    />
                    <InputField
                        label="Email"
                        name="email"
                        value={formData?.billFrom?.email}
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, "billFrom")}
                    />
                    <TextAreaField
                        label="Address"
                        name="address"
                        value={formData?.billFrom?.address}
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, "billFrom")}
                    />
                    <InputField
                        label="Phone"
                        name="phone"
                        value={formData?.billFrom?.phone}
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, "billFrom")}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Bill To</h3>

                    <InputField
                        label="Client Name"
                        name="clientName"
                        value={formData?.billTo?.clientName}
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, "billTo")}
                    />

                    <InputField
                        label="Client Email"
                        name="email" // <-- must match formData.billTo.email
                        value={formData?.billTo?.email}
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, "billTo")}
                    />

                    <TextAreaField
                        label="Client Address"
                        name="address" // <-- must match formData.billTo.address
                        value={formData?.billTo?.address}
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, "billTo")}
                    />

                    <InputField
                        label="Client Phone"
                        name="phone"
                        value={formData?.billTo?.phone}
                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, "billTo")}
                    />
                </div>

            </div>

            <div className=" bg-white border border-slate-200 rounded-lg shadow-sm shadow-gray-100 overflow-x-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900">Items</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase  tracking-wider ">
                                    Item
                                </th>
                                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase  tracking-wider ">
                                    Qty
                                </th>
                                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase  tracking-wider ">
                                    Price
                                </th>
                                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase  tracking-wider ">
                                    Tax (%)
                                </th>
                                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase  tracking-wider ">
                                    Total
                                </th>
                                <th className="px-2 sm:px-6 py-3  "></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {(formData?.items || []).map((item, index) => {
                                const qty = Number(item?.quantity) || 0;
                                const price = Number(item?.unitPrice) || 0;
                                const tax = Number(item?.taxPercent) || 0;
                                const itemTotal = qty * price * (1 + tax / 100);

                                return (
                                    <tr key={index} className="hover:bg-slate-200">
                                        <td className="px-2 sm:px-6 py-4">
                                            <input
                                                type="text"
                                                name="name"
                                                value={item?.name ?? ""}
                                                placeholder="Items Name"
                                                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate 400 focus:outline-none foucs:ring-2 focus:ring-blue-500 focus:border-transparent "
                                                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, null, index)}
                                            />
                                        </td>
                                        <td className="px-2 sm:px-6 py-4">
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={item?.quantity ?? 0}
                                                placeholder="Items Quantity"
                                                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate 400 focus:outline-none foucs:ring-2 focus:ring-blue-500 focus:border-transparent "
                                                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, null, index)}
                                            />
                                        </td>
                                        <td className="px-2 sm:px-6 py-4">
                                            <input
                                                type="number"
                                                name="unitPrice"
                                                value={item?.unitPrice ?? 0}
                                                placeholder="Price"
                                                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate 400 focus:outline-none foucs:ring-2 focus:ring-blue-500 focus:border-transparent "
                                                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, null, index)}
                                            />
                                        </td>
                                        <td className="px-2 sm:px-6 py-4">
                                            <input
                                                type="number"
                                                name="taxPercent"
                                                value={item?.taxPercent ?? 0}
                                                placeholder="Tax (%)"
                                                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate 400 focus:outline-none foucs:ring-2 focus:ring-blue-500 focus:border-transparent "
                                                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, null, index)}
                                            />
                                        </td>
                                        <td className="px-2 sm:px-6 py-4 text-slate-500">${formatNumber(itemTotal)}</td>
                                        <td className="px-2 sm:px-6 py-4">
                                            <Button type="button" variant="ghost" size="small" onClick={() => handleRemoveItem(index)}>
                                                <Trash2 className="" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 sm:p-6 border-t border-slate-200">
                    <Button type="button" variant="secondary" onClick={handleAdditem} icon={Plus}>
                        Add Item
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4">
                    <h3 className="">Notes & Terms</h3>
                    <TextAreaField label="Notes" name="notes" value={formData?.notes ?? ""} onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLTextAreaElement>, null)} />
                    <SelectedField label="Payment Terms" name="terms" value={formData?.paymentTerms ?? ""} onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLSelectElement>, null)} options={["Net 15", "Net 30", "Net 60", "Due on receipt"]} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 flex flex-col justify-center">
                    <div className=" space-y-4">
                        <div className="flex justify-between text-sm text-slate-600">
                            <p className="">Subtotal:</p>
                            <p className="">$ {formatNumber(subtotal)}</p>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <p className="">Tax:</p>
                            <p className="">$ {formatNumber(taxTotal)}</p>
                        </div>
                        <div className="flex justify-between text-lg font-semibold border-t border-slate-200 pt-4 mt-4 text-slate-600">
                            <p className="">Total:</p>
                            <p className="">$ {formatNumber(total)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreateInvoice;
