import { useLocation, useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPath"
import { Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import moment from 'moment'
import { useAuth } from "../../context/AuthContext"
import { useEffect, useState } from "react"


const CreateInvoice = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()

    const [formData, setFormData] = useState(existingInvoice || {
        invoiceNumber: "",
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: "",
        billFrom: {
            businessName: user?.businessName || "",
            email: user?.email || "",
            address: user?.address || "",
            phone: user?.phone || "",
        }, billTo: { clientName: "", email: "", address: "", phone: "" },
        items: [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
        notes: "", paymentTerms: "Net 15",

    })

    const [isGeneratingNumber, setIsGeneratingNumber] = useState(!existingInvoice)
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        const aiData = location.state?.aiData

        if (aiData) {
            setFormData(prev => ({
                ...prev, billTo: { clientName: aiData?.clientName || "", email: aiData?.email || "", address: aiData?.address || "", phone: "" },
                items: aiData?.items || [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }]
            }))
        }

        if (existingInvoice) {
            setFormData({
                ...existingInvoice, invoiceDate: moment(existingInvoice?.invoiceDate).format("YYYY-MM-DD"),
                dueDate: moment(exisitingInvoice?.dueDate).formart("YYYY-MM-DD")


            })
        }
        else {
            const generateNewInvoiceNumber = async () => {
                setIsGeneratingNumber(true)
                try {
                    const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES)
                    const invoices = response.data
                    let maxNum = 0
                    invoices.foreach((inv) => {
                        const num = parseInt(inv.invoiceNumber.split('-')[1])
                        if (!isNaN(num) && num > maxNum) maxNum = num
                    })
                    const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, '0')}`

                    setFormData((prev) => ({
                        ...prev, invoiceNumber: newInvoiceNumber
                    }))
                }
                catch (err) {
                    console.error("Failed to generate invoice number ", err)
                    setFormData((prev) => ({ ...prev, invoiceNumber: `INV-${Date.now().toString().slice(-5)}` }))

                }
                setIsGeneratingNumber(false)
            }
            generateNewInvoiceNumber()
        }

    }, [existingInvoice])

    //handlers
    const handleInputChange = (e, section, index) => { }

    const handleAdditem = () => {
        setFormData({
            ...formData, items: [...formData.items, { name: "", quanntity: 1, unitPrice: 0, taxpercent: 0 }]
        })

    }



    const handleRemoveItem = (index) => { }

    const { subtotal, taxTotal, total } = () => {
        let subtotal = 0, taxTotal = 0
        formData?.items?.forEach((item) => {
            const itemTotal = ((item?.quantity || 0)) * (item?.unitPrice || 0)
            subtotal += itemTotal
            taxTotal += itemTotal * ((item?.taxpercent))
        })
        return { subtotal, taxTotal, total: subtotal + taxTotal }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
    }

    //handleAddItem
    return (
        <div>CreateInvoice</div>
    )
}

export default CreateInvoice