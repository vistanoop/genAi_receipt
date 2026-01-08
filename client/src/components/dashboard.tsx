
import { useState } from "react"
import { Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"


export default function Dashboard() {
    const navigate = useNavigate()
    const [loanAmount, setLoanAmount] = useState([50000])
    const [formData, setFormData] = useState({
        farmer_id: "",
        land_size_acres: "",
        crop_type: "",
        irrigation: "",
        loan_purpose: "",
        experience_years: "",
        location: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [lastRequestTime, setLastRequestTime] = useState(0)


    const handleSubmit = async () => {
        setError(null)

        // Rate Limiting: Prevent rapid requests (Basic client-side anti-spam)
        const now = Date.now()
        if (now - lastRequestTime < 5000) {
            setError("Please wait a few seconds before submitting again.")
            return
        }
        setLastRequestTime(now)

        // Check for empty required fields
        const requiredFields = [
            { key: "farmer_id", label: "Farmer ID" },
            { key: "land_size_acres", label: "Land Size" },
            { key: "experience_years", label: "Farming Experience" },
            { key: "crop_type", label: "Crop Type" },
            { key: "irrigation", label: "Irrigation Type" },
            { key: "loan_purpose", label: "Loan Purpose" },
            { key: "location", label: "Location" }
        ]

        const missingFields = requiredFields
            .filter(field => !formData[field.key as keyof typeof formData])
            .map(field => field.label)

        if (missingFields.length > 0) {
            setError(`Please fill in the following required fields: ${missingFields.join(", ")} `)
            return
        }

        // Validate Numeric Values
        const landSize = Number(formData.land_size_acres)
        const experience = Number(formData.experience_years)
        const amount = Number(loanAmount[0])

        if (isNaN(landSize) || landSize <= 0) {
            setError("Land Size must be a valid positive number")
            return
        }
        if (isNaN(experience) || experience < 0) {
            setError("Farming Experience must be a valid non-negative number")
            return
        }

        if (isNaN(amount) || amount < 10000) {
            setError("Loan Amount must be at least ₹10,000")
            return
        }

        // Logical Constraints
        if (experience > 70) {
            setError("Please verify the farming experience years; value seems unusually high.")
            return
        }

        if (landSize > 10000) {
            setError("Land size exceeds maximum eligible limit for this automated assessment.")
            return
        }

        // Regex Validation for Farmer ID
        const farmerIdRegex = /^[A-Za-z0-9-]+$/;
        if (!farmerIdRegex.test(formData.farmer_id)) {
            setError("Farmer ID contains invalid characters. Only alphanumeric characters and hyphens are allowed.");
            return;
        }

        setLoading(true)

        try {
            const payload = {
                farmer_id: formData.farmer_id,
                land_size_acres: landSize,
                crop_type: formData.crop_type,
                irrigation: formData.irrigation,
                loan_purpose: formData.loan_purpose,
                experience_years: experience,
                location: formData.location,
                loan_amount: amount
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/assess`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {

                if (response.status === 400) {
                    throw new Error("Invalid request data. Please check your inputs.");
                } else if (response.status === 500) {
                    throw new Error("Server error. Please try again later.");
                } else {
                    throw new Error("Assessment failed.");
                }
            }

            const data = await response.json()
            // Navigate to report page with data
            navigate("/report", { state: data })

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Unable to process assessment. Please verify your inputs and try again.");
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (error) setError(null)
    }

    return (
        <div className="min-h-screen bg-[#0a0f1c] font-sans text-white selection:bg-green-500/30">
            {/* Header */}
            <header className="border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                            <Sprout className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold tracking-tight text-white leading-none">AgriScoreX</h1>
                            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">Credit Assessment</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">

                    {/* Left Column: Form */}
                    <div className="">
                        <Card className="h-full border border-white/5 shadow-2xl shadow-black/40 bg-[#161b2c] rounded-3xl overflow-hidden">
                            <CardHeader className="pb-6 border-b border-white/5">
                                <CardTitle className="text-2xl font-bold text-white">Credit Assessment Request</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Enter farming details to assess creditworthiness and determine eligible loan amount
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 p-8">

                                <div className="space-y-4">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="farmer_id" className="text-sm font-semibold text-gray-300">Farmer ID</Label>
                                        <Input
                                            id="farmer_id"
                                            placeholder="e.g. KC1-1001"
                                            value={formData.farmer_id}
                                            onChange={(e) => handleChange("farmer_id", e.target.value)}
                                            maxLength={20}
                                            className="h-12 !bg-[#0a0f1c] border-white/10 !text-white placeholder:text-gray-600 focus-visible:ring-green-500/50 focus-visible:border-green-500 rounded-xl"
                                        />
                                        <p className="text-xs text-gray-500">Valid ID range: KC1-1000 to KC1-1025</p>
                                    </div>

                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="loan-amount" className="text-sm font-semibold text-gray-300">Requested Loan Amount (₹)</Label>
                                            <span className="text-lg font-bold text-green-400">₹{loanAmount[0].toLocaleString()}</span>
                                        </div>
                                        <Input
                                            id="loan-amount"
                                            type="number"
                                            value={loanAmount[0]}
                                            onChange={(e) => setLoanAmount([Number(e.target.value)])}
                                            className="h-12 !bg-[#0a0f1c] border-white/10 !text-white focus-visible:ring-green-500/50 focus-visible:border-green-500 rounded-xl"
                                        />
                                    </div>

                                    <div className="pt-2 pb-4">
                                        <Slider
                                            value={loanAmount}
                                            onValueChange={setLoanAmount}
                                            max={500000}
                                            min={1000}
                                            step={1000}
                                            className="py-2 [&_[data-slot=slider-range]]:bg-green-500 [&_[data-slot=slider-thumb]]:border-green-500 [&_[data-slot=slider-thumb]]:bg-white"
                                        />
                                        <p className="text-right text-xs text-gray-500 mt-1">
                                            Maximum: ₹5,00,000
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="location" className="text-sm font-semibold text-gray-300">Location</Label>
                                        <Select onValueChange={(val) => handleChange("location", val)}>
                                            <SelectTrigger id="location" className="h-12 !bg-[#0a0f1c] border-white/10 !text-white focus-visible:ring-green-500/50 focus-visible:border-green-500 rounded-xl">
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#161b2c] border-white/10 text-white">
                                                <SelectItem value="raichur" className="focus:bg-green-500/20 focus:text-green-400">Raichur</SelectItem>
                                                <SelectItem value="mandya" className="focus:bg-green-500/20 focus:text-green-400">Mandya</SelectItem>
                                                <SelectItem value="hassan" className="focus:bg-green-500/20 focus:text-green-400">Hassan</SelectItem>
                                                <SelectItem value="guntur" className="focus:bg-green-500/20 focus:text-green-400">Guntur</SelectItem>
                                                <SelectItem value="nashik" className="focus:bg-green-500/20 focus:text-green-400">Nashik</SelectItem>
                                                <SelectItem value="ludhiana" className="focus:bg-green-500/20 focus:text-green-400">Ludhiana</SelectItem>
                                                <SelectItem value="karnal" className="focus:bg-green-500/20 focus:text-green-400">Karnal</SelectItem>
                                                <SelectItem value="thanjavur" className="focus:bg-green-500/20 focus:text-green-400">Thanjavur</SelectItem>
                                                <SelectItem value="vidisha" className="focus:bg-green-500/20 focus:text-green-400">Vidisha</SelectItem>
                                                <SelectItem value="nizamabad" className="focus:bg-green-500/20 focus:text-green-400">Nizamabad</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label htmlFor="land_size" className="text-sm font-semibold text-gray-300">Land Size (Acres)</Label>
                                        <Input
                                            id="land_size"
                                            type="number"
                                            placeholder="e.g. 5"
                                            value={formData.land_size_acres}
                                            onChange={(e) => handleChange("land_size_acres", e.target.value)}
                                            className="h-12 !bg-[#0a0f1c] border-white/10 !text-white placeholder:text-gray-600 focus-visible:ring-green-500/50 focus-visible:border-green-500 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="crop_type" className="text-sm font-semibold text-gray-300">Crop Type</Label>
                                        <Select onValueChange={(val) => handleChange("crop_type", val)}>
                                            <SelectTrigger id="crop_type" className="h-12 !bg-[#0a0f1c] border-white/10 !text-white focus-visible:ring-green-500/50 focus-visible:border-green-500 rounded-xl">
                                                <SelectValue placeholder="Select crop type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#161b2c] border-white/10 text-white">
                                                <SelectItem value="rice" className="focus:bg-green-500/20 focus:text-green-400">Rice</SelectItem>
                                                <SelectItem value="wheat" className="focus:bg-green-500/20 focus:text-green-400">Wheat</SelectItem>
                                                <SelectItem value="maize" className="focus:bg-green-500/20 focus:text-green-400">Maize</SelectItem>
                                                <SelectItem value="cotton" className="focus:bg-green-500/20 focus:text-green-400">Cotton</SelectItem>
                                                <SelectItem value="sugarcane" className="focus:bg-green-500/20 focus:text-green-400">Sugarcane</SelectItem>
                                                <SelectItem value="pulses" className="focus:bg-green-500/20 focus:text-green-400">Pulses</SelectItem>
                                                <SelectItem value="millets" className="focus:bg-green-500/20 focus:text-green-400">Millets</SelectItem>
                                                <SelectItem value="vegetables" className="focus:bg-green-500/20 focus:text-green-400">Vegetables</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label htmlFor="irrigation" className="text-sm font-semibold text-gray-300">Irrigation Type</Label>
                                        <Select onValueChange={(val) => handleChange("irrigation", val)}>
                                            <SelectTrigger id="irrigation" className="h-12 !bg-[#0a0f1c] border-white/10 !text-white focus-visible:ring-green-500/50 focus-visible:border-green-500 rounded-xl">
                                                <SelectValue placeholder="Select irrigation" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#161b2c] border-white/10 text-white">
                                                <SelectItem value="rainfed" className="focus:bg-green-500/20 focus:text-green-400">Rainfed</SelectItem>
                                                <SelectItem value="assured" className="focus:bg-green-500/20 focus:text-green-400">Assured</SelectItem>
                                                <SelectItem value="partial" className="focus:bg-green-500/20 focus:text-green-400">Partial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="experience" className="text-sm font-semibold text-gray-300">Farming Experience (Years)</Label>
                                        <Input
                                            id="experience"
                                            type="number"
                                            placeholder="e.g. 10"
                                            value={formData.experience_years}
                                            onChange={(e) => handleChange("experience_years", e.target.value)}
                                            className="h-12 !bg-[#0a0f1c] border-white/10 !text-white placeholder:text-gray-600 focus-visible:ring-green-500/50 focus-visible:border-green-500 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label htmlFor="purpose" className="text-sm font-semibold text-gray-300">Loan Purpose</Label>
                                        <Select onValueChange={(val) => handleChange("loan_purpose", val)}>
                                            <SelectTrigger id="purpose" className="h-12 !bg-[#0a0f1c] border-white/10 !text-white focus-visible:ring-green-500/50 focus-visible:border-green-500 rounded-xl">
                                                <SelectValue placeholder="Select loan purpose" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#161b2c] border-white/10 text-white">
                                                <SelectItem value="productive" className="focus:bg-green-500/20 focus:text-green-400">Productive</SelectItem>
                                                <SelectItem value="semi" className="focus:bg-green-500/20 focus:text-green-400">Semi-Productive</SelectItem>
                                                <SelectItem value="consumption" className="focus:bg-green-500/20 focus:text-green-400">Consumption</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {error && (
                                    <Alert variant="destructive" className="bg-red-500/5 text-red-300 border-red-500/10 [&>svg]:text-red-400">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Validation Error</AlertTitle>
                                        <AlertDescription>
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="pt-4">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full !bg-green-600 !hover:bg-green-700 text-white h-14 text-lg font-bold shadow-lg shadow-green-900/20 rounded-xl disabled:opacity-50 transition-all hover:scale-[1.01]"
                                    >
                                        {loading ? "Analyzing Profile..." : "Analyze Credit Profile"}
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    )
}
