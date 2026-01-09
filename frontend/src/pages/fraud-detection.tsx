import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
    ShieldAlert,
    Search,
    ShieldCheck,
    AlertTriangle,
    Building2,
    User,
    ArrowRight,
    Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";


import { checkFraud, getFraudAlerts } from "../services/api";
import type { FraudCheckResponse, FraudAlert } from "../services/api";
import { useEffect } from "react";

export default function FraudDetection() {
    const [activeTab, setActiveTab] = useState<"investor" | "startup">("investor");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<FraudCheckResponse | null>(null);
    const [alerts, setAlerts] = useState<FraudAlert[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getFraudAlerts().then(setAlerts);
    }, []);

    const performFraudCheck = async () => {
        if (!searchQuery) return;
        setLoading(true);
        setSearchResult(null);

        try {
            const result = await checkFraud(searchQuery, activeTab);
            setSearchResult(result);
        } catch (error) {
            console.error(error);
            // Optionally handle UI error state here
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="w-full space-y-8 max-w-5xl mx-auto">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
                                Fraud Detection
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium">
                                Verify the legitimacy of investors and startups before you engage.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Selection */}
                <div className="grid grid-cols-2 gap-4 p-1 bg-muted/50 rounded-2xl max-w-md">
                    <button
                        onClick={() => { setActiveTab("investor"); setSearchResult(null); setSearchQuery(""); }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "investor"
                            ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                            : "text-muted-foreground hover:bg-background/50"
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Verify Investor
                    </button>
                    <button
                        onClick={() => { setActiveTab("startup"); setSearchResult(null); setSearchQuery(""); }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "startup"
                            ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                            : "text-muted-foreground hover:bg-background/50"
                            }`}
                    >
                        <Building2 className="w-4 h-4" />
                        Verify Startup
                    </button>
                </div>

                {/* Main Search Area */}
                <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-premium relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2 text-center max-w-xl mx-auto">
                            <h2 className="text-2xl font-bold">
                                Check {activeTab === "investor" ? "Investor" : "Startup"} Credibility
                            </h2>
                            <p className="text-muted-foreground">
                                Enter the name, email, or domain of the {activeTab} you want to verify.
                                Our AI scans multiple databases for red flags.
                            </p>
                        </div>

                        <div className="flex gap-2 max-w-xl mx-auto pt-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder={activeTab === "investor" ? "e.g. Acme Ventures, john@vc.com" : "e.g. NextGen AI, tech-startup.io"}
                                    className="pl-12 h-14 rounded-xl text-lg bg-background border-border/60 focus:ring-primary/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && performFraudCheck()}
                                />
                            </div>
                            <Button
                                size="lg"
                                onClick={performFraudCheck}
                                disabled={loading || !searchQuery}
                                className="h-14 px-8 rounded-xl font-bold text-base bg-primary hover:bg-primary/90 text-white min-w-[120px]"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Verify"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <AnimatePresence mode="wait">
                    {searchResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`rounded-3xl p-8 border ${searchResult.status === "risk"
                                ? "bg-destructive/5 border-destructive/20"
                                : "bg-emerald-500/5 border-emerald-500/20"
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Result Card Header */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        {searchResult.status === "risk" ? (
                                            <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                                                <AlertTriangle className="w-8 h-8" />
                                            </div>
                                        ) : (
                                            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600">
                                                <ShieldCheck className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-2xl font-bold">{searchResult.entity}</h3>
                                            <p className="text-muted-foreground font-medium flex items-center gap-2">
                                                Status:
                                                <span className={searchResult.status === "risk" ? "text-destructive" : "text-emerald-600"}>
                                                    {searchResult.status === "risk" ? "Potential Risk Detected" : "Low Risk / Verified"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {searchResult.status === "risk" && (
                                        <div className="bg-background/50 rounded-xl p-4 border border-destructive/10 space-y-3">
                                            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Risk Factors</h4>
                                            <ul className="space-y-2">
                                                {searchResult.flags.map((flag: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm font-medium text-foreground/80">
                                                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                                                        {flag}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {searchResult.status === "safe" && (
                                        <div className="bg-background/50 rounded-xl p-4 border border-emerald-500/10 space-y-2">
                                            <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                                <ShieldCheck className="w-5 h-5" />
                                                <span>Entity verified against regulatory databases.</span>
                                            </div>
                                            <p className="text-sm text-foreground pl-7 leading-relaxed font-medium">
                                                {searchResult.summary}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Score Card */}
                                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm w-full md:w-auto min-w-[250px] space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Risk Score</p>
                                        <div className="flex items-end gap-2">
                                            <span className={`text-4xl font-bold ${searchResult.status === "risk" ? "text-destructive" : "text-emerald-600"
                                                }`}>
                                                {searchResult.score}
                                            </span>
                                            <span className="text-muted-foreground mb-1">/ 100</span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${searchResult.status === "risk" ? "bg-destructive" : "bg-emerald-500"
                                                    }`}
                                                style={{ width: `${searchResult.score}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border/50">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Last Checked</span>
                                            <span>{searchResult.lastChecked}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Global Recent Alerts (Mock) */}
                {!searchResult && (
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" />
                            Recent Fraud Alerts in the Community
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {alerts.length > 0 ? (
                                alerts.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card/50 hover:bg-card transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                {item.type === "Investor" ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">{item.type} • Reported {item.date}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`border-destructive/30 text-destructive bg-destructive/5 ${item.risk === 'High' ? 'animate-pulse' : ''}`}>
                                            {item.risk} Risk
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-8 text-muted-foreground">
                                    Scanning for recent alerts...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
