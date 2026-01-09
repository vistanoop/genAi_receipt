/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useLanguage } from "../contexts/LanguageContext";
import { chatWithAI, getHistory, getChatMessages, clearChatMessages, type AnalysisResponse } from "../services/api";
import { supabase } from "../utils/supabase";
import {
    Send,
    Bot,
    User as UserIcon,
    Loader2,
    ExternalLink,
    Sparkles,
    History,
    Info,
    TrendingUp,
    Globe,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: { title: string; url?: string; source_name: string }[];
}

export default function ChatPage() {
    const { language } = useLanguage();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
    const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>("");
    const [user, setUser] = useState<any>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchHistory(currentUser.id);
                fetchChatHistory(currentUser.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchHistory(currentUser.id);
                fetchChatHistory(currentUser.id);
            } else {
                setMessages([]);
                setAnalyses([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const fetchHistory = async (userId: string) => {
        try {
            const data = await getHistory(userId);
            setAnalyses(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchChatHistory = async (userId: string) => {
        try {
            const history = await getChatMessages(userId);
            const formattedHistory: Message[] = history.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
                sources: msg.sources || []
            }));
            setMessages(formattedHistory);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMessage = input.trim();
        setInput("");
        const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);
        try {
            const response = await chatWithAI({
                message: userMessage,
                analysis_id: selectedAnalysisId || undefined,
                language: language,
                user_id: user?.id,
                chat_history: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
            });
            setMessages(prev => [...prev, { role: "assistant", content: response.answer, sources: response.sources }]);
        } catch (error: any) {
            toast({ title: "Chat error", description: "Failed to get a response.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = async () => {
        if (!user || messages.length === 0) return;
        if (!confirm("Are you sure you want to clear your chat history?")) return;

        try {
            await clearChatMessages(user.id);
            setMessages([]);
            toast({ title: "Chat cleared", description: "Your conversation history has been deleted." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to clear chat.", variant: "destructive" });
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] w-full max-w-7xl mx-auto px-4 md:px-0 overflow-hidden font-display">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-4 border-b border-border/40 shrink-0">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground text-left">
                            Q & A
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Interact with your startup&apos;s AI intelligence in real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        {messages.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClear}
                                className="h-11 px-4 rounded-xl border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-all font-bold text-xs"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear Chat
                            </Button>
                        )}
                        <div className="w-full md:w-80">
                            <Select value={selectedAnalysisId} onValueChange={setSelectedAnalysisId}>
                                <SelectTrigger className="h-11 rounded-xl bg-card border-border/50 hover:border-primary/40 transition-all text-xs font-bold shadow-sm">
                                    <div className="flex items-center gap-2.5 truncate">
                                        <History className="w-4 h-4 text-primary shrink-0" />
                                        <SelectValue placeholder="Select Startup Context" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/60 shadow-xl p-1 min-w-[280px]">
                                    {analyses.length > 0 ? (
                                        analyses.map((analysis) => (
                                            <SelectItem
                                                key={analysis.analysis_id}
                                                value={analysis.analysis_id}
                                                className="rounded-xl px-4 py-3 focus:bg-primary/5 cursor-pointer"
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-sm text-foreground capitalize truncate max-w-[220px]">
                                                        {analysis.startup_summary}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground/80 uppercase tracking-widest font-black">
                                                        {analysis.metadata.sector} • {analysis.metadata.stage}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-10 text-center flex flex-col items-center gap-3">
                                            <Bot className="w-8 h-8 text-muted-foreground/20" />
                                            <p className="text-sm font-bold text-foreground">No analyses yet</p>
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 relative">
                    <ScrollArea ref={scrollRef} className="flex-1">
                        <div className="w-full space-y-6 py-8 md:py-10">
                            <AnimatePresence mode="popLayout">
                                {messages.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center justify-center py-10 md:py-16 text-center space-y-6"
                                    >
                                        <div className="w-16 h-16 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center relative">
                                            <Bot className="w-8 h-8 text-primary" />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
                                        </div>

                                        <div className="space-y-2 px-4">
                                            <h3 className="text-2xl font-bold text-foreground tracking-tight">
                                                How can I help you today?
                                            </h3>
                                            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                                                Ask about market trends, investor strategies, or your specific analysis report.
                                            </p>
                                        </div>

                                        <div className="hidden md:grid grid-cols-2 gap-3 w-full max-w-2xl mt-4 px-4">
                                            {[
                                                { q: "What are the top 3 VCs for my sector?", icon: TrendingUp },
                                                { q: "Summarize recent funding trends in India.", icon: Globe },
                                                { q: "Is my current stage ready for Series A?", icon: Sparkles },
                                                { q: "Analyze the regulatory impact locally.", icon: Info }
                                            ].map((suggestion, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setInput(suggestion.q)}
                                                    className="p-4 rounded-2xl bg-card border border-border/50 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-primary/[0.02] shadow-sm transition-all text-left flex flex-col gap-3 group"
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                        <suggestion.icon className="w-3.5 h-3.5 text-primary" />
                                                    </div>
                                                    <span className="leading-snug">{suggestion.q}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {messages.map((message, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex flex-col w-full mb-6",
                                            message.role === "user" ? "items-end" : "items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center gap-2 mb-2",
                                            message.role === "user" ? "flex-row-reverse" : ""
                                        )}>
                                            <div className={cn(
                                                "w-7 h-7 rounded-lg flex items-center justify-center shadow-sm",
                                                message.role === "user" ? "bg-primary text-white" : "bg-muted border border-border/40 text-foreground"
                                            )}>
                                                {message.role === "user" ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                                {message.role === "user" ? "Founder" : "AI Analyst"}
                                            </span>
                                        </div>

                                        <div className={cn(
                                            "p-4 md:p-6 rounded-2xl text-[15px] leading-relaxed shadow-sm border prose prose-sm max-w-4xl",
                                            message.role === "user"
                                                ? "bg-primary text-white border-primary/20 rounded-tr-none prose-invert font-medium"
                                                : "bg-card border-border/50 text-foreground rounded-tl-none dark:prose-invert font-medium"
                                        )}>
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>

                                        {message.sources && message.sources.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {message.sources.map((source, sIdx) => (
                                                    <a
                                                        key={sIdx}
                                                        href={source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/40 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 transition-all font-sans"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                        {source.title.slice(0, 40)}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {isLoading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start w-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 rounded-lg bg-muted border border-border/40 flex items-center justify-center">
                                                <Bot className="w-3.5 h-3.5 text-foreground" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                                                Thinking...
                                            </span>
                                        </div>
                                        <div className="p-4 rounded-2xl rounded-tl-none bg-card border border-border/50 shadow-sm">
                                            <div className="flex gap-1.5">
                                                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>

                    <div className="sticky bottom-4 md:bottom-8 w-full pt-2 pb-2 bg-transparent shrink-0">
                        <div className="max-w-3xl mx-auto px-1">
                            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/50 md:bg-muted/40 border border-border/40 focus-within:border-primary/40 focus-within:bg-background/80 transition-all shadow-sm">
                                <Input
                                    className="flex-1 bg-transparent border-none py-4 px-4 h-auto text-[15px] focus-visible:ring-0 placeholder:text-muted-foreground/40 font-bold"
                                    placeholder="Ask anything about your startup..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg p-0 transition-all active:scale-95 shrink-0"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
