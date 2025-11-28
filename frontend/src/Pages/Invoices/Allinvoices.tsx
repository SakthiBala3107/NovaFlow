import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { AlertCircle, Edit, FileText, Loader2, Mail, Plus, Search, Sparkles, Trash2 } from "lucide-react"

import moment from "moment"
import { useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import { useDeleteInvoice, useGetInvoices, useUpdateInvoice } from "../../hooks/UseQueries"
import CreateWithAIModal from "../../components/modals/CreateWithAIModal"
import ReminderModal from "../../components/modals/ReminderModal"
import clsx from "clsx"
import DeleteConfirmModal from "../../components/modals/DeleteModal"
import toast from "react-hot-toast"
import type { InvoiceStatusPayload, InvoiceType } from "../../types/data.types"


const Allinvoices = () => {
    // const { data: invoices, isLoading, isError } = useGetInvoices();
    const { mutate: deleteInvoice, isPending: deleteLoading } = useDeleteInvoice();
    const { mutate: updateInvoice, } = useUpdateInvoice();

    // pagination
    // Fetch invoices paginated
    const {
        data: invoicePages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError
        , isLoading: invoicesLoading,
    } = useGetInvoices();

    // Refs
    const invoicesContainerRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Sentinel ref using callback (recommended)
    const invoicesSentinelRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (!node) return;

            // Disconnect old observer
            if (observerRef.current) observerRef.current.disconnect();

            // Create new observer
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    const [entry] = entries;
                    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                        console.log("📡 Fetching next invoice page...");
                        fetchNextPage();
                    }
                },
                {
                    root: invoicesContainerRef.current,
                    rootMargin: "0px 0px 200px 0px",
                    threshold: 0.1,
                }
            );

            observerRef.current.observe(node);
            console.log("👀 Invoice observer attached");
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    // Flatten invoice list
    const invoicesList = useMemo(() => {
        return invoicePages?.pages.flatMap((page) => page.results ?? []) ?? [];
    }, [invoicePages]);




    // const [invoices, setInvoices] = useState<string[]>([])
    // const [loading, setLoading] = useState<boolean>(false)
    // const [error, setError] = useState<string | null>(null)
    const [statusChangeLoading, setStatusChangeLoading] = useState<string | undefined>("")
    const [searchTerm, setSearchTerm] = useState<string | undefined>("")
    const navigate = useNavigate()
    const [statusFilter, setStatusFilter] = useState<string>("All")
    const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false)
    const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | number | undefined>("")
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);


    //handlers
    // const handleDelete = async (id: string | number | undefined) => { }


    const handleOpenReminderModal = (invoiceId: number | string | undefined) => {
        setSelectedInvoiceId(invoiceId)
        setIsReminderModalOpen(true)
    }


    const handleOpenDeleteModal = (id: string) => {
        setInvoiceToDelete(id);
        setDeleteModalOpen(true);
    };

    //delete  a invoice
    const confirmDelete = () => {
        if (!invoiceToDelete) return;

        deleteInvoice(invoiceToDelete, {
            onSuccess: (res) => {
                console.log("Invoice deleted:", res);
                setDeleteModalOpen(false);
                setInvoiceToDelete(null);
                toast.success("Invoice deleted successfully");
            },

            onError: (err) => {
                console.error("Delete failed:", err);
                toast.error("Failed to delete invoice");
            }
        });
    };






    const handleStatusChange = (invoice: InvoiceType) => {
        if (!invoice?._id) return;

        setStatusChangeLoading(invoice._id);

        const newStatus =
            invoice.status === "Paid" ? "Unpaid" : "Paid";

        const updatedInvoice: InvoiceStatusPayload = {
            status: newStatus,
        };

        updateInvoice(
            {
                id: invoice._id,
                data: updatedInvoice,
            },
            {
                onSuccess: (response) => {
                    // ✔ Update UI locally (exactly like your tutorial)
                    setInvoices((prev) =>
                        prev?.map((inv) =>
                            inv._id === invoice._id ? response : inv
                        )
                    );

                    setStatusChangeLoading('');
                },
                onError: () => {
                    setStatusChangeLoading('');
                },
            }
        );
    };









    const filteredInvoicesList = useMemo(() => {
        return invoicesList
            ?.filter(
                (invoice) =>
                    statusFilter === "All" || invoice.status === statusFilter
            )
            ?.filter((invoice) => {
                const invoiceNumber = invoice.invoiceNumber ?? "";
                const clientName = invoice.billTo?.clientName ?? "";
                const search = searchTerm?.toLowerCase() ?? "";

                return (
                    invoiceNumber.toLowerCase().includes(search) ||
                    clientName.toLowerCase().includes(search)
                );
            }) || [];
    }, [invoicesList, searchTerm, statusFilter]);



    // global loading
    const loading = deleteLoading

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
            </div>
        )
    }

    // ERROR UI ❌
    if (isError) {
        return (
            <div className="text-center text-red-500 mt-6">
                Failed to load invoices.
            </div>
        )
    }

    if (invoicesLoading)
        return (<div className="w-[90vw] md:w-full max-h-[60vh] overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <th key={i} className="px-6 py-3">
                                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-slate-200">
                    {Array.from({ length: 6 }).map((_, row) => (
                        <tr key={row}>
                            {Array.from({ length: 6 }).map((_, col) => (
                                <td key={col} className="px-6 py-4">
                                    <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)


    // const invoicesHave = filteredInvoicesList?.length > 9
    //
    return (
        <div className="bg-app space-y-6">
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />

            <CreateWithAIModal isOpen={isAiModalOpen} onclose={() => setIsAiModalOpen(false)} />
            <ReminderModal
                isOpen={isReminderModalOpen}
                onclose={() => setIsReminderModalOpen(false)}
                invoiceId={selectedInvoiceId}
            />
            {/*  */}
            <div className="flex flex-col   sm:flex-col  justify-between items-start sm:items-start gap-4">
                <div className="w-full flex flex-col  md:flex-row items-center justify-between">
                    <div className="">
                        <h1 className="text-2xl font-semibold text-slate-900">All Invoices</h1>
                        <p className="text-sm text-slate-600 mt-1"> Manage all you invoices in one place</p>
                    </div>
                    {/*  */}
                    <div className="flex items-center gap-2 mt-2 md:mt-1 px-2 md:p-0">
                        <Button
                            // className="text-sm"
                            variant="secondary"
                            onClick={() => setIsAiModalOpen(true)}
                            icon={Sparkles}
                        >
                            <small className="block md:hidden">Create With AI</small>
                            <span className="hidden md:block">Create with AI</span>
                        </Button>

                        <Button onClick={() => navigate('/invoices/new')} icon={Plus}>
                            <small className="block md:hidden">Create Invoice</small>
                            <span className="hidden md:block">Create Invoice</span>
                        </Button>
                    </div>
                </div>
                {/*  */}
                {isError && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <p className="text-sm text-red-700">{isError}</p>
                            </div>
                        </div>
                    </div>

                )}
                {/*  */}

                <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="p4 sm:p-6 border-b border-slate-200">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="w-5 h-5 text-slate-400" />
                                </div>
                                <input type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by invoice # or client..." className="w-full h-10 pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            {/*  */}

                            <div className="shrink-0">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full sm:w-auto h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 foucs:ring-blue-500">
                                    <option value="All">All Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  */}
                {filteredInvoicesList?.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg">No Invoices found</h3>
                        <p className="text-slate-500 mb-6 max-w-md">Your search  or filter criteria did nto match any invoices.  Try adjusting you search</p>
                        {filteredInvoicesList?.length === 0 && (
                            <Button onClick={() => navigate('/invoices/new')} icon={Plus}>Create your first invoice</Button>
                        )}
                    </div>
                ) : (
                    <div className="w-[90vw] md:w-full max-h-[60vh] overflow-y-auto shadow-inner [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                    {/* {invoicesHave && (<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{filteredInvoicesList?.length} Invoices</th>)} */}
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-slate-200">

                                {/* Render invoices */}
                                {filteredInvoicesList?.map((invoice) => (
                                    <tr className="hover:bg-slate-50" key={invoice?._id}>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 cursor-pointer"
                                            onClick={() => navigate(`/invoices/${invoice?._id}`)}
                                        >
                                            {invoice?.invoiceNumber}
                                        </td>

                                        <td onClick={() => navigate(`/invoices/${invoice?._id}`)}>
                                            {invoice?.billTo?.clientName}
                                        </td>

                                        <td onClick={() => navigate(`/invoices/${invoice?._id}`)}>
                                            {invoice?.total?.toFixed(2) || "0.00"}
                                        </td>

                                        <td onClick={() => navigate(`/invoices/${invoice?._id}`)}>
                                            {invoice?.dueDate ? moment(invoice?.dueDate).format("MMM DD, YYYY") : "N/A"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                    invoice?.status === "Paid"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : invoice?.status === "Pending"
                                                            ? "bg-amber-100 text-amber-800"
                                                            : "bg-red-100 text-red-800"
                                                )}
                                            >
                                                {invoice?.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    size="small"
                                                    variant="secondary"
                                                    onClick={() => handleStatusChange(invoice)}
                                                    isLoading={statusChangeLoading === invoice?._id}
                                                >
                                                    {statusChangeLoading === invoice?._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        invoice?.status === "Paid" ? "Mark Unpaid" : "Mark Paid"
                                                    )}
                                                </Button>

                                                <Button size="small" variant="ghost" onClick={() => navigate(`/invoices/${invoice?._id}`)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>

                                                <Button size="small" variant="ghost" onClick={() => handleOpenDeleteModal(invoice?._id)}>
                                                    <Trash2 className="text-red-500 w-4 h-4" />
                                                </Button>

                                                {invoice?.status !== "Paid" && (
                                                    <Button
                                                        size="small"
                                                        variant="ghost"
                                                        title="Generate Reminder"
                                                        onClick={() => handleOpenReminderModal(invoice?._id)}
                                                    >
                                                        <Mail className="text-blue-500 w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* Infinite scroll sentinel row */}
                                <tr>
                                    <td colSpan={6}>
                                        <div ref={invoicesSentinelRef} className="h-10 w-full"></div>

                                        {isFetchingNextPage && (
                                            <div className="py-4 flex items-center justify-center text-slate-500 text-sm">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Loading invoices...
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>


                        </table>
                    </div>




                )

                }
                {/*  */}
            </div>

            {/*  */}
        </div>
    )
}

export default Allinvoices