import { useState } from "react"
import type { AIModalProps, ApiError } from "../../types/data.types"
import { Loader2, Sparkles } from "lucide-react"
import Button from "../ui/Button"
import TextAreaField from "../ui/TextAreaField"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useParseInvoiceText } from "../../hooks/UseQueries"
import { providers } from "../../utils/data"






const CreateWithAIModal = ({ isOpen, onclose, invoiceId }: AIModalProps) => {
    const [text, setText] = useState<string>("")
    const [provider, setProvider] = useState<"gemini" | "openai">("gemini");
    const [open, setOpen] = useState<boolean>(false);

    const navigate = useNavigate()




    const { mutate: generateInvoice, isLoading } = useParseInvoiceText();

    const handleGenerate = () => {
        if (!text.trim()) {
            return toast.error('Please paste some text to generate an invoice.');
        }

        // Grab current provider selection
        const selectedProvider = provider?.toLowerCase() || "gemini";

        console.log("Generating invoice with provider:", selectedProvider);
        // Optional: reset provider in UI if you want to clear selection
        // setProvider("");

        generateInvoice(
            { text, provider: selectedProvider },
            {
                onSuccess: (response) => {
                    toast.success('Invoice generated successfully!');
                    onclose();

                    // Use the API response data to navigate
                    navigate('/invoices/new', { state: { aiData: response?.data } });
                },
                onError: (error: unknown) => {
                    const apiError = error as ApiError;
                    toast.error(apiError?.message || 'Failed to generate invoice.');
                },
            }
        );
    };






    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div className="fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity"
                    onClick={onclose}></div>

                {/*  */}
                <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform transition-transform">
                    <div className=" flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                            <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                            {" "} Create a Invoice with AI
                        </h3>
                        <button onClick={onclose} className="text-slate-400 hover:text-slate-600">&times;</button>
                    </div>
                    {/*  */}

                    <div className="space-y-4">
                        <p className="text-sm text-slate-600">Paste any text that contains invoice details (like client name, items, quantites and prices) and the AI will attempt to create an invoice from it </p>
                        <TextAreaField name="invoiceText" label={"Paste Invoice Text Here"}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="e.g., 'Invoice for ClientCorp: 2 hours of design work at $150/hr and 1 Logo for $300' "
                            rows={8}
                        />
                    </div>
                    {/*  */}
                    {/* Models dropdown */}
                    <div className="flex justify-between items-start mt-6 space-x-6">
                        {/* Models dropdown */}
                        <div className="relative">
                            <label className="font-medium text-slate-700 mb-1 block">Models:</label>

                            {/* Selected provider */}
                            <div
                                className="border border-slate-300 rounded px-3 py-2 cursor-pointer flex items-center justify-between w-40"
                                onClick={() => setOpen(!open)}
                            >
                                <div className="flex items-center space-x-2">
                                    {(() => {
                                        const SelectedIcon = providers?.find((p) => p.value === provider)?.icon;
                                        return SelectedIcon ? <SelectedIcon className="w-4 h-4 text-blue-600" /> : null;
                                    })()}
                                    <span className="font-medium">{providers?.find((p) => p.value === provider)?.label}</span>
                                </div>
                                <span className="text-slate-400">▼</span>
                            </div>

                            {/* Dropdown options */}
                            {open && (
                                <div className="absolute mt-1 w-full border rounded bg-white shadow-md z-10">
                                    {providers?.map((p) => {
                                        const Icon = p.icon;
                                        const isSelected = provider === p.value;
                                        return (
                                            <div
                                                key={p.value}
                                                className={`
                                flex items-center px-3 py-2 cursor-pointer space-x-2
                                hover:bg-blue-100
                                ${isSelected ? "bg-blue-200 font-semibold" : ""}
                            `}
                                                onClick={() => {
                                                    setProvider(p.value as "gemini" | "openai");
                                                    setOpen(false);
                                                }}
                                            >
                                                <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-700"}`} />
                                                <small>{p?.label}</small>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 mt-6">
                            <Button variant="secondary" onClick={onclose}>
                                Cancel
                            </Button>
                            <Button onClick={handleGenerate} isLoading={isLoading}>
                                {isLoading && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
                                {isLoading ? "Generating..." : "Generate Invoice"}
                            </Button>

                        </div>
                    </div>






                    {/*  */}
                </div>
            </div>
        </div>)
}

export default CreateWithAIModal