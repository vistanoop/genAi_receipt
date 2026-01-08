
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ArrowLeft, Check, AlertTriangle, X, TrendingUp, DollarSign, Droplets, Sprout, Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mapBoosterTip } from "@/lib/CreditBoosterMapper"


export default function Report() {
    const location = useLocation()
    const navigate = useNavigate()
    const data = location.state

    if (!data) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0f1c] text-white">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">No Assessment Data</h2>
                    <Button onClick={() => navigate("/")} className="mt-6 bg-white text-slate-900 hover:bg-gray-200">
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    const { decision, input_summary, optimized_plan, credit_booster, loan_amount: rawLoanAmount } = data
    const loan_amount = rawLoanAmount || 0

    // Risk Calculation
    const riskPercentage = (decision.default_probability * 100)
    const safetyPercentage = 100 - riskPercentage

    // Gauge Data for Recharts
    const gaugeData = [
        { name: 'Risk', value: riskPercentage },
        { name: 'Safety', value: safetyPercentage },
    ]

    // Theme Colors (Dark Mode)
    // We are using a manually defined dark palette to match requirements
    // Background: #0a0f1c (Dark Blue/Black)
    // Cards: #161b2c (Slightly lighter dark blue)
    // Text: White / Gray-400

    const riskLevel = decision.decision
    const isApproved = riskLevel === "APPROVE"

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white p-8 font-sans selection:bg-green-500/30">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto max-w-6xl space-y-8"
            >
                {/* Header */}
                <motion.div variants={item} className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white/90">Assessment Report</h1>
                        <p className="text-lg text-gray-400 mt-2 font-medium">Applicant: <span className="text-green-400">{input_summary.farmer_id}</span></p>
                    </div>
                    <Button onClick={() => navigate("/")} className="bg-white text-slate-900 hover:bg-gray-200 font-semibold px-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </motion.div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Grid 1: Risk Factor Speedometer */}
                    <motion.div variants={item} className="h-full">
                        <Card className="h-[400px] border border-white/5 shadow-2xl shadow-black/40 bg-[#161b2c] rounded-3xl overflow-hidden relative">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <CardTitle className="text-2xl font-bold text-gray-100">Risk Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="h-full flex flex-col items-center justify-center -mt-8">
                                <div className="relative h-64 w-full max-w-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                dataKey="value"
                                                startAngle={180}
                                                endAngle={0}
                                                data={gaugeData}
                                                cx="50%"
                                                cy="70%"
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={0}
                                                stroke="none"
                                            >
                                                <Cell key="risk" fill={riskLevel === 'REJECT' ? '#ef4444' : riskLevel === 'REVIEW' ? '#eab308' : '#22c55e'} />
                                                <Cell key="safe" fill="#2d3748" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>

                                    {/* Centered Text */}
                                    <div className="absolute inset-x-0 bottom-[20%] text-center">
                                        <div className="text-5xl font-black text-white">
                                            {riskPercentage.toFixed(1)}%
                                        </div>
                                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Risk Probability</div>
                                    </div>

                                    {/* Green Tick Overlay if Low Risk */}
                                    {riskPercentage < 30 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-0 right-0 bg-green-500/20 p-3 rounded-full shadow-lg ring-1 ring-green-500/50"
                                        >
                                            <Check className="h-8 w-8 text-green-400" />
                                        </motion.div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Grid 2: Decision Status */}
                    <motion.div variants={item} className="h-full">
                        <Card className={`h-[400px] border-none shadow-2xl shadow-black/40 rounded-3xl flex flex-col items-center justify-center text-center p-8
                            ${isApproved ? 'bg-gradient-to-br from-green-600 to-green-800 text-white' :
                                riskLevel === 'REVIEW' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-white' :
                                    'bg-gradient-to-br from-red-600 to-red-800 text-white'}
                        `}>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                            >
                                {isApproved ? <Check className="h-24 w-24 mx-auto mb-6 border-4 border-white/30 rounded-full p-4 bg-white/10 backdrop-blur-sm" /> :
                                    riskLevel === 'REVIEW' ? <AlertTriangle className="h-24 w-24 mx-auto mb-6 border-4 border-white/30 rounded-full p-4 bg-white/10 backdrop-blur-sm" /> :
                                        <X className="h-24 w-24 mx-auto mb-6 border-4 border-white/30 rounded-full p-4 bg-white/10 backdrop-blur-sm" />}

                                <h2 className="text-6xl font-black tracking-tighter uppercase mb-4 drop-shadow-md">
                                    {riskLevel}
                                </h2>
                                <p className="text-xl font-medium opacity-90 max-w-xs mx-auto leading-relaxed">
                                    {isApproved ? "Applicant meets criteria. Approved for funding." :
                                        riskLevel === 'REVIEW' ? "Manual verification required." :
                                            "Application rejected based on risk assessment."}
                                </p>
                            </motion.div>
                        </Card>
                    </motion.div>

                    {/* CASE: APPROVE - Show Input Details (Grid 3+4 Combined) */}
                    {isApproved && (
                        <motion.div variants={item} className="col-span-1 md:col-span-2">
                            <Card className="h-full border border-white/5 shadow-2xl shadow-black/40 bg-[#161b2c] rounded-3xl overflow-hidden">
                                <CardHeader className="border-b border-white/5 pb-4">
                                    <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                                        Application Summary & Approved Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Farmer ID</p>
                                            <p className="text-lg font-mono text-white">{input_summary.farmer_id}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Region</p>
                                            <p className="text-lg text-white capitalize">{input_summary.state}, {input_summary.city}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Crop Detail</p>
                                            <p className="text-lg text-white capitalize">{input_summary.crop_type}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Land Size</p>
                                            <p className="text-lg text-white">{input_summary.land_size_acres} Acres</p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Requested Amount</p>
                                            <p className="text-lg text-gray-300">₹{loan_amount.toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <p className="text-xs text-green-500 uppercase tracking-widest font-semibold">Approved Offer</p>
                                            <p className="text-3xl font-bold text-green-400">₹{(optimized_plan?.optimized_amount || loan_amount).toLocaleString()}</p>
                                        </div>
                                    </div>


                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* CASE: REVIEW - Show Loan Optimiser (Grid 3) and Booster (Grid 4) */}
                    {riskLevel === 'REVIEW' && (
                        <>
                            {/* Grid 3: Loan Details & Factors */}
                            <motion.div variants={item} className="h-full">
                                <Card className="h-full border border-white/5 shadow-2xl shadow-black/40 bg-[#161b2c] rounded-3xl overflow-hidden">
                                    <CardHeader className="border-b border-white/5 pb-4">
                                        <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                                            Risk Factors & Offer
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        {/* Loan Offer Section */}
                                        <div className="bg-[#0f1322] rounded-2xl p-6 border border-white/5">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-2xl text-green-400 uppercase tracking-wider font-bold">Safe Limit</p>
                                                    <div className="text-5xl font-extrabold text-white mt-1">
                                                        ₹{(optimized_plan?.optimized_amount || loan_amount).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg text-gray-500 mb-1">Requested</p>
                                                    <p className="text-3xl font-bold text-gray-600 line-through decoration-gray-500 decoration-2 ">₹{loan_amount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            {optimized_plan?.message && (
                                                <p className="text-lg text-yellow-200/80 mt-3 font-medium border-t border-white/5 pt-3">
                                                    {optimized_plan.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Risk Factors List */}
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Key Observations</h4>
                                            {decision.key_reasons.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {decision.key_reasons.map((reason: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 font-medium text-sm">
                                                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                                                            {/* Assuming reason is dynamic from backend, might need translation or is already English. Wrapping just in case */}
                                                            {reason}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-300 font-medium flex items-center gap-3">
                                                    No critical risk factors identified.
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Grid 4: Credit Booster */}
                            <motion.div variants={item} className="h-full">
                                <Card className="h-full border border-white/5 shadow-2xl shadow-black/40 bg-[#161b2c] rounded-3xl overflow-hidden">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-bold flex items-center gap-3 text-white">
                                            Improvement Plan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {credit_booster.length > 0 ? (
                                            credit_booster.map((tip: any, i: number) => {
                                                const mapped = mapBoosterTip(tip)

                                                return (
                                                    <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center gap-4 text-white">
                                                                <h5 className="font-bold text-lg ">
                                                                    {mapped.title}
                                                                </h5>
                                                            </div>
                                                            <span className="bg-green-700/80 text-white text-xs font-bold px-3 py-1 rounded-full border border-green-600">
                                                                +{(mapped.improvement * 100).toFixed(1)}% Approval
                                                            </span>
                                                        </div>
                                                        <p className="text-base font-medium text-gray-200 leading-relaxed pl-1">
                                                            {mapped.description}
                                                        </p>
                                                        <div className="mt-5 text-sm bg-black/20 p-3 rounded-lg border border-white/5 text-green-300 font-mono flex items-center gap-3">
                                                            <span className="opacity-70">Current Risk: <span className="text-white font-bold">{mapped.currentRisk}</span></span>
                                                            <ArrowRight className="h-4 w-4 text-gray-500" />
                                                            <span className="text-green-400 font-bold">
                                                                After Improvement: {mapped.improvedRisk}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                                                <Check className="h-12 w-12 mb-4 text-green-400" />
                                                <p className="text-xl font-bold">Profile Optimized</p>
                                                <p className="text-sm">No immediate actions required.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </>
                    )}

                    {/* CASE: REJECT - Combine Grid 3 & 4 into One Full Width Credit Booster */}
                    {riskLevel === 'REJECT' && (
                        <motion.div variants={item} className="h-full md:col-span-2">
                            <Card className="h-full border border-white/5 shadow-2xl shadow-black/40 bg-[#161b2c] rounded-3xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3 text-white">
                                        <TrendingUp className="h-5 w-5 text-red-300" />
                                        Critical Improvement Plan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {credit_booster.map((tip: any, i: number) => {
                                            const mapped = mapBoosterTip(tip)
                                            return (
                                                <div
                                                    key={i}
                                                    className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <h5 className="font-bold text-white text-lg">
                                                                {mapped.title}
                                                            </h5>
                                                        </div>

                                                        <span className="bg-green-700/80 text-white text-xs font-bold px-3 py-1 rounded-full border border-green-600">
                                                            +{(mapped.improvement * 100).toFixed(1)}% Approval
                                                        </span>
                                                    </div>

                                                    <p className="text-base font-medium text-gray-200 leading-relaxed pl-1">
                                                        {mapped.description}
                                                    </p>

                                                    <div className="mt-5 text-sm bg-black/20 p-3 rounded-lg border border-white/5 text-green-300 font-mono flex items-center gap-3">
                                                        <span className="opacity-70">Current Risk: <span className="text-white font-bold">{mapped.currentRisk}</span></span>
                                                        <ArrowRight className="h-4 w-4 text-gray-500" />
                                                        <span className="text-green-400 font-bold">
                                                            After Improvement: {mapped.improvedRisk}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                </div>
            </motion.div>
        </div>
    )
}
