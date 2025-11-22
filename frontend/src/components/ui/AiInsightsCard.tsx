import { Lightbulb } from "lucide-react"
import { useDashboardSummary } from "../../hooks/UseQueries"

const AiInsightsCard = () => {
    const { data: dashboardData, isLoading } = useDashboardSummary()

    const insights = dashboardData?.data?.insights ?? []

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm shadow-gray-100">
            <div className="flex items-center mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
            </div>

            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>

                </div>
            ) : (
                <ul className="space-y-3 list-disc list-inside text-slate-600 ml-3">
                    {insights?.map((insight, idx) => (
                        <li key={idx} className="text-sm">
                            {insight}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default AiInsightsCard
