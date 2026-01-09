import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { PlayCircle, Search, Clock, BookOpen, Video, TrendingUp, ExternalLink, Play, Sparkles, Trash2, RefreshCcw } from "lucide-react";
import { getVideoAcademy, searchVideoAcademy, syncVideoAcademy, resetVideoAcademy } from "../services/api";
import type { VideoIntelligence } from "../services/api";
import { supabase } from "../utils/supabase";
import { useToast } from "../hooks/use-toast";

export default function VideoAcademy() {
    const [videos, setVideos] = useState<VideoIntelligence[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [isSyncing, setIsSyncing] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadFeatured();
    }, []);

    const loadFeatured = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const data = await getVideoAcademy(12, true, user?.id);
            setVideos(data);
        } catch (error) {
            console.error("Failed to load academy videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);

        // Immediate feedback
        toast({
            title: "Scrapers Initialized",
            description: "AI is now crawling multimodal sources for the latest startup intelligence...",
        });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            await syncVideoAcademy(user?.id);

            // Redirect to refresh the page view
            navigate("/academy");

            toast({
                title: "Intelligence Refreshed",
                description: "New multimodal insights have been synchronized.",
            });
            loadFeatured();
        } catch (error) {
            toast({
                title: "Sync Failed",
                description: "Unable to reach the scraper pool. Try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleReset = async () => {
        if (!confirm("Are you sure you want to clear your local intelligence library?")) return;
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await resetVideoAcademy(user.id);
                toast({
                    title: "Library Flushed",
                    description: "All local multimodal data has been removed.",
                });
                setVideos([]);
            }
        } catch (error) {
            console.error("Reset failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            loadFeatured();
            return;
        }
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const data = await searchVideoAcademy(searchQuery, 10, user?.id);
            setVideos(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: "all", label: "All Sessions", icon: BookOpen },
        { id: "webinar", label: "Webinars", icon: Video },
        { id: "talk", label: "Expert Talks", icon: TrendingUp },
        { id: "interview", label: "Founders", icon: PlayCircle }
    ];

    const filteredVideos = activeCategory === "all"
        ? videos
        : videos.filter(v => v.category?.toLowerCase() === activeCategory);

    return (
        <DashboardLayout>
            <div className="w-full space-y-8 pb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground ">
                            Video Academy
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Official webinars and expert talks from the startup ecosystem.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="h-10 px-4 rounded-xl font-bold uppercase tracking-widest text-[9px] border-red-500/20 text-red-500 hover:bg-red-500/5"
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Flush
                        </Button>
                        <Button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="h-10 px-5 rounded-xl font-bold uppercase tracking-widest text-[9px] bg-primary group"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                            {isSyncing ? "Syncing..." : "Intelligence Sync"}
                        </Button>
                        <div className="h-6 w-px bg-border/40 mx-2" />
                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search transcripts..."
                                    className="h-10 pl-9 bg-muted/40 border-border/40 rounded-xl text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="h-10 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hidden sm:flex">
                                Search
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat.id
                                ? 'bg-primary border-primary text-white shadow-md shadow-primary/10'
                                : 'bg-card border-border/40 text-muted-foreground hover:border-primary/40'
                                }`}
                        >
                            <cat.icon className="w-3.5 h-3.5" />
                            {cat.label}
                        </button>
                    ))}
                </div>


                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <PlayCircle className="w-3.5 h-3.5 text-primary" /> Curated Sessions ({filteredVideos.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-video bg-muted/20 animate-pulse rounded-2xl border border-border/40" />
                            ))}
                        </div>
                    ) : filteredVideos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVideos.map((video) => (
                                <div key={video.evidence_id} className="group bg-card border border-border/40 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all flex flex-col">
                                    <div className="relative aspect-video bg-slate-900 border-b border-border/40">
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all cursor-pointer">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] font-black text-white/80 uppercase tracking-widest">
                                            <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
                                                <Clock className="w-3 h-3 text-primary" /> {video.duration}
                                            </span>
                                            <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">{video.published_year}</span>
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-4 flex-1 flex flex-col">
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black text-primary uppercase tracking-widest">{video.source_name}</p>
                                            <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight uppercase tracking-tight line-clamp-2">
                                                {video.title}
                                            </h4>
                                        </div>

                                        <p className="text-xs text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                                            {video.content}
                                        </p>

                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            <Badge variant="outline" className="rounded-lg font-bold text-[9px] uppercase border-border/60 text-muted-foreground">
                                                {video.sector}
                                            </Badge>
                                            <a
                                                href={video.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-all"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-muted/5 border-2 border-dashed border-border/60 rounded-[2rem] space-y-6">
                            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                                <Search className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                            <div className="space-y-2 text-center font-bold">
                                <h4 className="text-xl uppercase tracking-tight">Your Library is Empty</h4>
                                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto opacity-70">
                                    Click the <strong className="text-primary">Intelligence Sync</strong> button above to populate your personal academy with real-time multimodal data.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" onClick={() => { setSearchQuery(""); loadFeatured(); }} className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px]">
                                    Reset Search
                                </Button>
                                <Button onClick={handleSync} disabled={isSyncing} className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px]">
                                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                                    Initialize Library
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
