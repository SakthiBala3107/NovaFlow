import { useState } from "react"
import { FAQS } from "../../utils/data"
import { ChevronDown } from "lucide-react"
import type { FAQ } from "../../types/data.types"
import clsx from "clsx"


type FaqProps = {
    faq: FAQ,
    isOpen: number | boolean,
    onclick: () => void
}

const FaqItem = ({ faq, isOpen, onclick }: FaqProps) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button onClick={onclick} className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50  cursor-pointer transition-colors duration-200">
            <span className="text-lg font-medium text-gray-900 pr-4 text-left">{faq?.question}</span>
            <ChevronDown className={clsx("w-6 h-6 text-gray-400 transition-transform duration-300", isOpen ? "transform rotate-180" : "")} />
        </button>
        {isOpen && (
            <div className="p-6 pb-6 pt-6 text-gray-600 leading-relaxed border-t border-gray-100">
                {faq?.answer}
            </div>
        )}
    </div>
)





// primary-comp
const Faqs = () => {

    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const handleClick = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx)
    }

    // renderin-stuffs
    return (
        <section id="faq" className="py-20 lg:py-28 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to know about the product and billing.</p>
                </div>
                {/*  */}
                <div className="space-y-4">
                    {FAQS?.map((faq, idx) => {
                        return (
                            <FaqItem
                                key={idx} faq={faq} isOpen={openIndex === idx}
                                onclick={() => handleClick(idx)}
                            />
                        )
                    })}
                </div>
            </div>
        </section>)
}

export default Faqs