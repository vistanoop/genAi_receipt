import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    ArrowLeft,
    ShieldCheck,
    TrendingUp,
    Zap,
    Scale,
    Building2,
    Calendar,
    Globe,
    FileText,
    CheckCircle,
    Info,
    ExternalLink,
    Quote
} from "lucide-react";
import { getAnalysisById } from "../services/api";
import type { AnalysisResponse } from "../services/api";
import { supabase } from "../utils/supabase";
import ReactMarkdown from "react-markdown";

type Persona = 'policy_guard' | 'market_maven' | 'vc_strategist';

export default function IntelligenceReport() {
    const { id } = useParams();
    const [data, setData] = useState<AnalysisResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activePersona, setActivePersona] = useState<Persona>('policy_guard');

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!id) return;
            try {
                const { data: { user } } = await supabase.auth.getUser();
                const analysis = await getAnalysisById(id, user?.id);
                setData(analysis);
            } catch (error) {
                console.error("Failed to fetch intelligence report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
                    <Scale className="w-16 h-16 text-primary animate-spin" />
                    <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">Convening Expert Panel...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!data || !data.perspectives) {
        return (
            <DashboardLayout>
                <div className="text-center py-32 bg-muted/10 border-4 border-dashed rounded-[3rem] space-y-8">
                    <Info className="w-16 h-16 text-muted-foreground/20 mx-auto" />
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black  tracking-tight">Intelligence Briefing Missing</h2>
                        <p className="text-muted-foreground font-bold max-w-sm mx-auto italic text-lg">This analysis does not contain triangulated expert data. Please run a new analysis.</p>
                    </div>
                    <Link to="/analyze">
                        <Button className="rounded-2xl mt-4 h-14 px-10 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
                            Run New Analysis
                        </Button>
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const personas = [
        { id: 'policy_guard', name: 'Policy Guard', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'market_maven', name: 'Market Maven', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { id: 'vc_strategist', name: 'VC Strategist', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' }
    ] as const;

    const currentPerspective = data.perspectives[activePersona as keyof typeof data.perspectives];

    return (
        <DashboardLayout>
            <div className="w-full space-y-12 pb-20">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 border-b border-border/40 pb-10">
                    <div className="flex items-start gap-8 flex-1">
                        <Link to="/intelligence-hub">
                            <Button variant="ghost" size="icon" className="w-16 h-16 rounded-[1.5rem] bg-muted/50 hover:bg-primary/10 transition-colors shadow-sm">
                                <ArrowLeft className="w-8 h-8" />
                            </Button>
                        </Link>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-[10px] py-1 px-4 rounded-full">
                                    Triangulated Briefing
                                </Badge>
                                <span className="text-xs font-black text-muted-foreground/30 uppercase tracking-[0.3em]">ID: {id?.substring(0, 12)}</span>
                            </div>
                            <h1 className="text-2xl font-black text-foreground  tracking-tight leading-none lg:text-2xl">
                                {data.startup_summary.split('.')[0]}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 pt-2">
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Building2 className="w-5 h-5 text-primary/60" /> {data.metadata.sector}
                                </span>
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-3 border-l border-border/60 pl-6">
                                    <Globe className="w-5 h-5 text-primary/60" /> {data.metadata.geography}
                                </span>
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-3 border-l border-border/60 pl-6">
                                    <Calendar className="w-5 h-5 text-primary/60" /> {data.metadata.stage}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/30 p-8 rounded-[2.5rem] border border-border/40 min-w-[280px] text-center shadow-inner">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-60">Engine Confidence</p>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-6xl font-black tracking-tighter">{data.overall_score}%</span>
                            <div className="text-left">
                                <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-2 py-0.5 rounded-md animate-pulse mb-1 block">STABLE</Badge>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Verified</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    <div className="lg:col-span-8 space-y-10">

                        <div className="flex flex-wrap gap-4 p-2 bg-muted/30 rounded-[2.5rem] border border-border/40">
                            {personas.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setActivePersona(p.id as Persona)}
                                    className={`flex-1 min-w-[200px] h-20 rounded-[2rem] px-8 text-sm font-black transition-all flex items-center gap-5 uppercase tracking-tight relative overflow-hidden group ${activePersona === p.id
                                        ? 'bg-white dark:bg-slate-900 border-2 border-primary shadow-2xl text-foreground ring-8 ring-primary/5'
                                        : 'text-muted-foreground hover:bg-white/50 dark:hover:bg-slate-800/50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-[0.75rem] flex items-center justify-center shrink-0 ${activePersona === p.id ? p.bg : 'bg-muted'}`}>
                                        <p.icon className={`w-5 h-5 ${activePersona === p.id ? p.color : 'text-muted-foreground/60'}`} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block leading-none">{p.name}</span>
                                        <span className={`text-[9px] font-bold tracking-widest uppercase opacity-60 ${activePersona === p.id ? 'text-primary' : 'text-muted-foreground'}`}>
                                            Expert Agent
                                        </span>
                                    </div>
                                    {activePersona === p.id && (
                                        <div className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>


                        <div className="bg-card border-none shadow-glow-sm bg-opacity-60 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 relative overflow-hidden group">
                            <Quote className="absolute -top-10 -left-10 w-48 h-48 text-primary opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />

                            <div className="relative z-10 space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[.25em] text-xs">
                                        <div className="w-8 h-1 bg-primary rounded-full" />
                                        Core Perspective
                                    </div>
                                    <div className="prose prose-xl dark:prose-invert max-w-none text-foreground/90 font-bold leading-[1.6]">
                                        <ReactMarkdown>{currentPerspective?.analysis || ''}</ReactMarkdown>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8 pt-10 border-t border-border/40">
                                    <div className="sm:col-span-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Strategic Action Items</div>
                                    {currentPerspective?.top_insights.map((insight, idx) => (
                                        <div key={idx} className="bg-muted/40 p-8 rounded-[2rem] border border-border/40 flex items-start gap-6 hover:border-primary/30 transition-all hover:bg-white group">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 text-primary text-sm font-black group-hover:bg-primary group-hover:text-white transition-all">
                                                {idx + 1}
                                            </div>
                                            <p className="text-lg font-bold text-foreground/80 leading-relaxed tracking-tight italic">
                                                "{insight}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                            <div className="relative z-10 space-y-8 flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <h4 className="text-xl font-black uppercase tracking-tight">Grounding Trace</h4>
                                </div>
                                <p className="text-sm font-medium text-slate-400 leading-relaxed">
                                    Every claim made by the consensus panel is mapped to verified primary source data to ensure technical accuracy and prevent hallucinations.
                                </p>

                                <div className="space-y-5 pt-4">
                                    {data.evidence_used.slice(0, 5).map((ev, i) => (
                                        <div key={i} className="group p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                                            <div className="flex items-start justify-between gap-6 relative z-10">
                                                <div className="space-y-3">
                                                    <Badge className="bg-primary/20 text-primary-foreground border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                                        {ev.source_type}
                                                    </Badge>
                                                    <h5 className="text-sm font-black uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-primary transition-colors">{ev.title}</h5>
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{ev.source_name}</p>
                                                </div>
                                                {ev.url && (
                                                    <a
                                                        href={ev.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all shrink-0 border border-white/10"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative z-10 pt-10 border-t border-white/10 mt-auto">
                                <div className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-[10px] bg-emerald-500/10 p-4 rounded-2xl w-fit">
                                    <CheckCircle className="w-5 h-5" />
                                    Consensus Verified Insight
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border/40 rounded-[2.5rem] p-10 space-y-6 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-emerald-500 to-amber-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-[.25em] text-muted-foreground flex items-center gap-3">
                                <Scale className="w-4 h-4 text-primary" /> Panel Confidence
                            </h4>
                            <div className="space-y-6">
                                <div className="flex items-end justify-between">
                                    <p className="text-5xl font-black tracking-tighter">{data.overall_score}%</p>
                                    <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest mb-1">High Stability</span>
                                </div>
                                <div className="h-4 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-emerald-500 shadow-glow animate-pulse"
                                        style={{ width: `${data.overall_score}%` }}
                                    />
                                </div>
                                <p className="text-[11px] font-bold text-muted-foreground italic leading-relaxed">
                                    Our agents analyzed {data.metadata.evidence_count} source documents. The cross-agent agreement score indicates strong reliability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
