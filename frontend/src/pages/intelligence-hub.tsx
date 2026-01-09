import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import {
    ShieldCheck,
    TrendingUp,
    Zap,
    ArrowRight,
    MessageSquare,
    Search,
    Clock,
    Scale,
    Building2,
    ChevronRight
} from "lucide-react";
import { getHistory } from "../services/api";
import type { AnalysisResponse } from "../services/api";
import { supabase } from "../utils/supabase";
import { formatRelativeTime } from "../lib/utils";

export default function IntelligenceHub() {
    const [reports, setReports] = useState<AnalysisResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                const history = await getHistory(user?.id);
                setReports(history.reverse());
            } catch (error) {
                console.error("Failed to fetch intelligence reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const experts = [
        { name: "Policy Guard", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { name: "Market Maven", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { name: "VC Strategist", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" }
    ];

    return (
        <DashboardLayout>
            <div className="w-full space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Intelligence Hub
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Consolidated briefings from our Multi-Agent Expert Panel.
                        </p>
                    </div>
                    <Link to="/analyze">
                        <Button className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-xs shadow-md shadow-primary/5 hover:shadow-primary/10 transition-all">
                            Run New Analysis
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {experts.map((agent) => (
                        <div key={agent.name} className={`p-6 rounded-[1.25rem] border-2 ${agent.border} ${agent.bg} relative overflow-hidden group hover:scale-[1.01] transition-all`}>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0`}>
                                    <agent.icon className={`w-6 h-6 ${agent.color}`} />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-sm uppercase tracking-tight text-foreground">{agent.name}</h4>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Status</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <agent.icon className="w-20 h-20" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5" /> Latest Briefings ({reports.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 w-full bg-muted/20 animate-pulse rounded-2xl border border-border/40" />
                            ))}
                        </div>
                    ) : reports.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 pb-10">
                            {reports.map((report) => (
                                <Link
                                    key={report.analysis_id}
                                    to={`/intelligence-hub/report/${report.analysis_id}`}
                                    className="block group"
                                >
                                    <div className="bg-card border border-border/40 p-5 rounded-[1.25rem] hover:shadow-lg hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between group overflow-hidden relative">
                                        <div className="flex items-center gap-6 min-w-0 flex-1">
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 shadow-xl shrink-0">
                                                <Scale className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                                                    {report.startup_summary.split('.')[0]}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5 bg-muted/40 px-2 py-0.5 rounded-md"><Building2 className="w-3 h-3" /> {report.metadata.sector}</span>
                                                    <span className="flex items-center gap-1.5 bg-muted/40 px-2 py-0.5 rounded-md"><Clock className="w-3 h-3" /> {formatRelativeTime(report.created_at || '')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0 mt-4 md:mt-0">
                                            <div className="text-center min-w-[70px]">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Score</p>
                                                <p className="text-2xl font-black text-primary tracking-tighter whitespace-nowrap">{report.overall_score}%</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-muted/5 border-2 border-dashed border-border/60 rounded-[2rem] space-y-8">
                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center opacity-40 shadow-inner">
                                <Search className="w-6 h-6" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h4 className="text-2xl font-bold uppercase tracking-tight text-foreground">No Intelligence Recorded</h4>
                                <p className="text-sm text-muted-foreground font-semibold max-w-sm mx-auto">
                                    Start an analysis to populate this hub with triangulated insights from our expert panel.
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link to="/analyze">
                                    <Button className="rounded-xl h-12 px-10 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                        Initialize First Analysis
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
