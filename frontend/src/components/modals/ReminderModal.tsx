import { useEffect, useState } from "react";
import type { AIModalProps } from "../../types/data.types";
import Button from "../ui/Button";
import TextAreaField from "../ui/TextAreaField";
import toast from "react-hot-toast";
import { Check, Copy, Loader2, Mail } from "lucide-react";
import { useGenerateReminder } from "../../hooks/UseQueries";

const ReminderModal = ({ isOpen, onclose, invoiceId }: AIModalProps) => {
    const [hasCopied, setHasCopied] = useState(false);

    // Custom mutation hook
    const { mutate, data, isLoading } = useGenerateReminder();

    // Trigger mutation when modal opens
    useEffect(() => {
        if (isOpen && invoiceId) {
            mutate({ invoiceId });
        }
    }, [isOpen, invoiceId, mutate]);

    const handleCopyToClipboard = () => {
        if (data?.reminderText) {
            navigator.clipboard.writeText(String(data.reminderText));
            setHasCopied(true);
            toast.success("Reminder copied to clipboard");
            setTimeout(() => setHasCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-black/10 z-0"
                    onClick={onclose}
                ></div>

                {/* Modal content */}
                <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative z-10 text-left transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-blue-900" />
                            AI-Generated Reminder
                        </h3>
                        <button
                            onClick={onclose}
                            className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Body */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                            ) : (
                                <TextAreaField
                                    name="reminderText"
                                    value={data?.reminderText ? String(data.reminderText) : ""}
                                    readOnly
                                    rows={10}
                                />
                            )}

                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="secondary" onClick={onclose} size="medium">
                            Close
                        </Button>

                        <Button
                            onClick={handleCopyToClipboard}
                            icon={hasCopied ? Check : Copy}
                            isLoading={isLoading}
                            disabled={!data?.reminderText}
                        >
                            {hasCopied ? "Copied" : "Copy Text"}
                        </Button>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default ReminderModal;
