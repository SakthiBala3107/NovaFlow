import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPath"
import { AlertCircle, Edit, Loader2, Mail, Printer } from "lucide-react"
import toast from "react-hot-toast"
import CreateInvoice from "./CreateInvoice"
import Button from "../../components/ui/Button"
import ReminderModal from "../../components/modals/ReminderModal"
import { useEditInvoice, useInvoiceById } from "../../hooks/UseQueries"
import type { InvoicePayload } from "../../types/data.types"
import clsx from "clsx"



const InvoiceDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [invoice, setInvoice] = useState<InvoicePayload | string | number | null>(null)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false)
    const invoiceRef = useRef<HTMLDivElement>(null)


    const { data: invoiceData, isLoading, isError, } = useInvoiceById(id);
    const { mutate: editInvoice, isPending: isUpdating } = useEditInvoice();


    const handleUpdate = (formData: InvoicePayload) => {
        editInvoice(
            { id: String(id), data: formData },
            {
                onSuccess: (response) => {
                    toast.success("Invoice updated successfully!");
                    setIsEditing(false);
                    setInvoice(response);
                },
                onError: () => {
                    toast.error("Failed to update invoice.");
                }
            }
        );
    };

    const handlePrint = () => {
        window.print()
    }



    //

    if (!invoiceData) {
        return <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-lg">

            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 ">
                <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Invoice Not Found</h3>
            <p className="text-slate-500 mb-6 max-w-md">The invoiceyou are looking for does not exists or could not be loaded.</p>
            <Button onClick={() => navigate('/invoices')}>Back to ALl Invoices</Button>
        </div>
    }
    if (isEditing) {
        return <CreateInvoice existingInvoice={invoiceData} onSave={handleUpdate} />
    }

    //
    return (
        <>
            <ReminderModal isOpen={isReminderModalOpen} onclose={() => setIsReminderModalOpen(false)} />
            <div className="flex flex-co sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
                <h1 className="text-2xl font-semibold text-slate-900 mb-4 sm:mb-0">Invoice <span className="font-momo text-slate-500">{invoiceData?.invoiceNumber}</span></h1>
                {/*  */}
                <div className="flex items-center gap-2">
                    {invoiceData?.status === "Paid" && (
                        <Button
                            variant="secondary"
                            onClick={() => setIsReminderModalOpen(true)}
                            icon={Mail}
                        >
                            Generate Reminder
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        onClick={() => setIsEditing(true)}
                        icon={Edit}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handlePrint}
                        icon={Printer}
                    >
                        Print or Download
                    </Button>
                </div>

            </div >
            {/*  */}
            <div id="invoice-content-wrapper">
                <div
                    ref={invoiceRef}
                    id="invoice-content"
                    className=" bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-md border border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start pb-8  border-b border-slate-200">
                        <div className="">
                            <h2 className="text-3xl font-bold text-slate-900">INVOICE</h2>
                            <p className="text-sm text-slate-500 mt-2"># {invoiceData?.invoiceNumber}</p>
                        </div>
                        {/*  */}
                        <div className="text-left sm:text-right mt-4 sm:mt-0">
                            <p className="text-sm text-slate-500">Status</p>
                            <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', invoiceData?.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                invoiceData?.status === 'Unpaid' ? 'bg-yellow-100 text-yellow-800' :
                                    invoiceData?.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                        'bg-slate-100 text-slate-800'

                            )}>{invoiceData?.status}
                            </span>
                        </div>




                    </div>



                    <div className=" grid grid-cols-1 sm:grid-cols-2 gap-8 my-8">
                        <div className="">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Bill From</h3>
                            <p className="font-semibold text-slate-900">{invoiceData?.billFrom?.businessName}</p>
                            <p className="text-slate-600">{invoiceData?.billFrom?.address}</p>
                            <p className="text-slate-600">{invoiceData?.billFrom?.email}</p>
                            <p className="text-slate-600">{invoiceData?.billFrom?.phone}</p>
                        </div>
                        {/*  */}

                        <div className="sm:text-right">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Bill To</h3>
                            <p className="font-semibold text-slate-900">{invoiceData?.billTo?.businessName}</p>
                            <p className="text-slate-600">{invoiceData?.billTo?.address}</p>
                            <p className="text-slate-600">{invoiceData?.billTo?.email}</p>
                            <p className="text-slate-600">{invoiceData?.billTo?.phone}</p>
                        </div>



                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-8">
                        <div className="">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Invoice Date</h3>
                            <p className="font-medium text-slate-800">{new Date(invoiceData?.invoiceDate).toLocaleString()}</p>
                        </div>
                        {/*  */}
                        <div className="">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Due Date</h3>
                            <p className="font-medium text-slate-800">{new Date(invoiceData?.dueDate).toLocaleString()}</p>
                        </div>
                        <div className="">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Payment Terms</h3>
                            <p className="font-medium text-slate-800">{invoiceData?.paymentTerms}</p>
                        </div>


                    </div>

                    <div className="bg-white border broder-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className=" px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ">Item</th>
                                    <th className=" px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider ">Qty</th>
                                    <th className=" px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider ">Price</th>
                                    <th className=" px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider ">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {invoiceData?.items?.map((item, index) => (
                                    <tr key={index} className="">
                                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-slate-900">{item?.name}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-right text-slate-900">{item?.quantity}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-right text-slate-600">${item?.unitPrice?.toFixed(2)}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-right text-slate-900">${item?.total?.toFixed(2)}</td>
                                    </tr>))}
                            </tbody>
                        </table>
                    </div>

                    {/*  */}
                    <div className="flex justify-end mt-8">
                        <div className="w-full max-w-sm space-y-3">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span>${invoiceData?.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Tax</span>
                                <span>${invoiceData?.taxTotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold text-slate-900 border-t border-slate-200 pt-3 mt-3 ">
                                <span>Total</span>
                                <span>${invoiceData?.total?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    {invoiceData?.notes && (
                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Notes</h4>
                            <p className="text-sm text-slate-600">${invoiceData?.notes}</p>
                        </div>
                    )}


                    {/*  */}
                </div>
            </div>


            {/*  */}

            <style>
                {`
                    @page {
                        padding: 10px;
                    }

                    @media print {
                        body * {
                        visibility: hidden;
                        }
                        #invoice-content-wrapper,
                        #invoice-content-wrapper * {
                        visibility: visible;
                        }
                        #invoice-content-wrapper {
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        width: 100%;
                        }
                        #invoice-preview {
                        box-shadow: none;
                        border: none;
                        border-radius: 0;
                        padding: 0;
                        margin: 0;
                        }
                    }
                    `}
            </style>

        </>
    )
}

export default InvoiceDetail