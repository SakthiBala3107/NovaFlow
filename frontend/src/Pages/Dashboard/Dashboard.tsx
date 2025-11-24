import { useMemo } from "react";
import { DollarSign, FileText, Plus } from "lucide-react";
import type { ColorMap, StatsItem } from "../../types/date.types";
import { useGetAllInvoices } from "../../hooks/UseQueries";
import toast from "react-hot-toast";
import moment from 'moment';
import clsx from "clsx";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import AiInsightsCard from "../../components/ui/AiInsightsCard";

const Dashboard = () => {
    const navigate = useNavigate();
    const { data: invoiceData, isLoading: isFetching, error } = useGetAllInvoices();

    const Invoices = invoiceData ?? [];

    // Derived stats
    const totalInvoices = Invoices?.length;
    const totalPaid = Invoices?.filter(inv => inv?.status?.toLowerCase() === "paid")
        .reduce((acc, inv) => acc + (inv?.total ?? 0), 0);
    const totalUnpaid = Invoices.filter(inv => inv?.status?.toLowerCase() !== "paid")
        .reduce((acc, inv) => acc + (inv?.total ?? 0), 0);

    const stats: StatsItem[] = [
        { icon: FileText, label: "Total Invoices", value: totalInvoices, color: "blue" },
        { icon: DollarSign, label: "Total Paid", value: totalPaid, color: "emerald" },
        { icon: DollarSign, label: "Total Unpaid", value: totalUnpaid, color: "red" },
    ];

    const colorClasses: ColorMap = {
        blue: { bg: 'bg-blue-100', text: "text-blue-600" },
        emerald: { bg: 'bg-emerald-100', text: "text-emerald-600" },
        red: { bg: 'bg-red-100', text: "text-red-600" },
    };

    // Recent invoices
    const recentInvoices = useMemo(() => {
        return [...Invoices]
            .sort((a, b) => new Date(b?.invoiceDate ?? 0).getTime() - new Date(a?.invoiceDate ?? 0).getTime())
            .slice(0, 5);
    }, [Invoices]);

    // 🔵 Skeleton loading
    if (isFetching) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 shadow-lg animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                <div className="h-6 w-32 bg-slate-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // 🔴 Error
    if (error) {
        toast.error("Failed to load invoices. Please try again.");
        return (
            <div className="w-full h-[60vh] flex items-center justify-center text-red-600 font-semibold">
                Failed to load invoices.
            </div>
        );
    }

    return (
        recentInvoices.length > 0 ? (
            <div className="space-y-8 ">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
                    <p className="text-sm text-slate-600 mt-1">A quick overview of your business finances.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-lg shadow-gray-100">
                            <div className="flex items-center">
                                <div className={clsx("shrink-0 w-12 h-12 rounded-lg flex items-center justify-center", colorClasses[stat.color]?.bg)}>
                                    <stat.icon className={clsx("w-6 h-6", colorClasses[stat.color]?.text)} />
                                </div>
                                <div className="ml-4 min-w-0">
                                    <div className="text-sm font-medium text-slate-500 truncate">{stat.label}</div>
                                    <div className="text-2xl font-bold text-slate-900 break-all">
                                        {stat.value}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Insight Card */}
                <AiInsightsCard />

                {/* Recent Invoices Table */}
                <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
                        <Button variant="ghost" onClick={() => navigate('/invoices')}>View All</Button>
                    </div>

                    <table className="table-fixed w-full">
                        <thead>
                            <tr>
                                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {recentInvoices.map(invoice => (
                                <tr
                                    key={invoice?._id}
                                    className="hover:bg-slate-50 cursor-pointer"
                                    onClick={() => navigate(`/invoices/${invoice?._id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{invoice?.billTo?.clientName}</div>
                                        <div className="text-sm text-slate-500">#{invoice?.invoiceNumber}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                                        ${invoice.total?.toFixed(2)}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-slate-800">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            invoice.status === "paid"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : invoice.status === "pending"
                                                    ? "bg-amber-100 text-amber-800"
                                                    : "bg-red-100 text-red-800"
                                        )}>
                                            {invoice.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {moment(invoice?.dueDate).format("MMM D, YYYY")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No invoices yet</h3>
                <p className="text-slate-500 mb-6 max-w-md">You haven't created any invoices yet. Get started by creating your first one.</p>
                <Button icon={Plus} onClick={() => navigate('/invoices/new')}>Create Invoice</Button>
            </div>
        )
    );
};

export default Dashboard;
