import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowRight,
  Search,
  FileText,
  Users,
  BarChart3,
  Clock,
  Plus,
  History,
  TrendingUp,
  PlayCircle
} from "lucide-react";
import { getStats, getHistory } from "../services/api";
import type { AnalysisResponse } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import { supabase } from "../utils/supabase";

import { formatRelativeTime } from "../lib/utils";

export default function Dashboard() {
  const { language } = useLanguage();
  const [stats, setStats] = useState([
    { label: "Analyses Run", value: "0", icon: Search, color: "bg-blue-500/10 text-blue-600" },
    { label: "Investors Matched", value: "0", icon: Users, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Evidence Points", value: "0", icon: FileText, color: "bg-amber-500/10 text-amber-600" },
    { label: "Avg. Fit Score", value: "0%", icon: BarChart3, color: "bg-purple-500/10 text-purple-600" },
  ]);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        const [statsData, historyData] = await Promise.all([
          getStats(userId),
          getHistory(userId),
        ]);

        const history = historyData.slice(-5).reverse();

        setStats([
          { label: "Analyses Run", value: statsData.total_analyses.toString(), icon: Search, color: "bg-blue-500/10 text-blue-600" },
          { label: "Investors Matched", value: statsData.total_investors.toString(), icon: Users, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Evidence Points", value: statsData.total_evidence.toString(), icon: FileText, color: "bg-amber-500/10 text-amber-600" },
          { label: "Avg. Fit Score", value: statsData.avg_score, icon: BarChart3, color: "bg-purple-500/10 text-purple-600" },
        ]);

        setRecentAnalyses(history);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/40">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Keep track of your startup analyses and funding intelligence.
            </p>
          </div>
          <Link to="/analyze">
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white px-6 shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 h-11 font-bold">
              <Plus className="w-4 h-4" />
              New Analysis
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col gap-4">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-muted animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Recent Analysis
              </h2>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-20 text-center text-muted-foreground font-medium animate-pulse">
                  Loading recent analyses...
                </div>
              ) : recentAnalyses.length === 0 ? (
                <div className="p-20 text-center text-muted-foreground font-medium flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <History className="w-8 h-8 opacity-20" />
                  </div>
                  <p>No analyses found. Run your first analysis to see it here!</p>
                  <Link to="/analyze">
                    <Button variant="outline" size="sm" className="rounded-lg">Start First Analysis</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {recentAnalyses.map((analysis) => (
                    <Link
                      key={analysis.analysis_id}
                      to={`/results/${analysis.analysis_id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-muted/30 transition-all group"
                    >
                      <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center ring-1 ring-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                          <TrendingUp className="w-5 h-5 text-primary group-hover:text-white" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {analysis.startup_summary.split('.')[0]}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-muted-foreground capitalize flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${analysis.confidence_indicator === 'high' ? 'bg-emerald-500' :
                                analysis.confidence_indicator === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                                }`} />
                              {analysis.confidence_indicator} Confidence
                            </span>
                            <span className="text-[10px] text-muted-foreground/60">•</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(analysis.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0">
                        <Badge
                          variant="secondary"
                          className={`rounded-lg px-3 py-1 font-bold text-sm whitespace-nowrap ${analysis.confidence_indicator === "high"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                            : analysis.confidence_indicator === "medium"
                              ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                              : "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                            }`}
                        >
                          {analysis.overall_score}% Fit Score
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground font-display">Quick Actions</h2>
            <div className="space-y-4">
              <Link to="/analyze" className="block group">
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                        New Analysis
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        Run a fresh AI analysis on your startup's funding fit.
                      </p>
                    </div>
                  </div>
                </div>
              </Link>



              <div className="bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-primary/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <h3 className="text-lg font-bold mb-2">Need help?</h3>
                <p className="text-sm text-shadow text-muted-foreground mb-6">
                  Our AI Chatbot can help you decode the insights for your particular startup idea.
                </p>
                <Link to="/chat">
                  <Button className="w-full rounded-xl bg-foreground text-background font-bold h-11">Open AI Chat</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
