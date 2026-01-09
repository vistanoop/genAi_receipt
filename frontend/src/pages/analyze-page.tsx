/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Sparkles, Info, Target, Lightbulb, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { analyzeStartup } from "../services/api";
import { LoadingModal } from "../components/LoadingModal";
import { supabase } from "../utils/supabase";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "motion/react";

const sectors = [
  "Healthcare & Life Sciences",
  "Financial Services & FinTech",
  "Education & EdTech",
  "E-Commerce & Retail",
  "Enterprise Software & SaaS",
  "Consumer Internet",
  "Deep Tech & AI",
  "Climate & Clean Energy",
  "Logistics & Supply Chain",
  "Media & Entertainment",
  "Other",
];

const stages = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Growth",
];

const geographies = [
  "India - Pan India",
  "India - Metro Cities",
  "India - Tier 2/3 Cities",
  "Southeast Asia",
  "Global",
  "North America",
  "Europe",
];

const generationLanguages = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengali" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "kn", label: "Kannada" },
];

export default function Analyze() {
  const { language: currentLanguage } = useLanguage();
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [geography, setGeography] = useState("");
  const [reportLang, setReportLang] = useState(currentLanguage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !sector || !stage || !geography) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    const { data: { user } } = await supabase.auth.getUser();

    try {
      const result = await analyzeStartup({
        startup_name: startupName || "Unnamed Project",
        startup_description: description,
        sector: sector,
        funding_stage: stage,
        geography: geography,
        language: reportLang,
        user_id: user?.id,
      });

      localStorage.setItem("latestAnalysis", JSON.stringify(result));
      localStorage.setItem(
        "latestStartup",
        JSON.stringify({
          sector,
          stage,
          geography,
        })
      );
      navigate(`/results/${result.analysis_id}`);
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description:
          error.message || "Unable to analyze right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <LoadingModal isOpen={isAnalyzing} />
      <div className="w-full space-y-6 pb-10">
        <div className="space-y-1 pb-4 border-b border-border/40 font-display">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Analyze Funding Fit
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Generate evidence-backed funding intelligence for your startup.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6 font-display"
            >
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="startupName" className="text-lg font-bold">Startup Name (Optional)</Label>
                    <Input
                      id="startupName"
                      placeholder="e.g. NextGen AI"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      className="h-12 rounded-xl border-border/60 text-lg font-medium"
                    />
                    <p className="text-xs text-muted-foreground">Provide the name to verify its credibility against fraud databases.</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="description" className="text-lg font-bold">
                        Startup Description
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          setDescription("KAn AI-first B2B trade platform for small retail shop owners (Kirana stores) in Tier 2 and Tier 3 India. We are building a voice-controlled 'AI Agent' that speaks in 8+ regional Indian languages (Hindi, Marathi, Tamil, etc.) to help shop owners manage inventory and digital ledgers without typing. By analyzing unstructured voice-data, we build proprietary credit scoring models (Verticalized LLMs) to offer instant working capital loans to the Next Billion users. We focus on high unit economics and sustainable scaling, solving the 'Digital Divide' for Bharat's merchants.");
                          setSector("Financial Services & FinTech");
                          setStage("Seed");
                          setGeography("India - Tier 2/3 Cities");
                          toast({
                            title: "Sample Loaded",
                            description: "Form pre-filled with AI Agent (FinTech) data.",
                          });
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 border border-primary/20 px-2 py-0.5 rounded-full bg-primary/5 hover:bg-primary/10"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        Try a Sample
                      </button>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      Required
                    </span>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Describe your startup's core problem, solution, and unique value proposition..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[220px] resize-none text-base p-4 rounded-xl border-border/60 focus:ring-primary/20 transition-all font-medium"
                    required
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <p>Be specific for better AI insights.</p>
                    <p className="font-medium">{description.length} characters</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="sector" className="text-sm font-semibold">Sector</Label>
                    <Select value={sector} onValueChange={setSector}>
                      <SelectTrigger id="sector" className="h-11 rounded-xl bg-background/50 border-border/60">
                        <SelectValue placeholder="Select Sector" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {sectors.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="stage" className="text-sm font-semibold">Funding Stage</Label>
                    <Select value={stage} onValueChange={setStage}>
                      <SelectTrigger id="stage" className="h-11 rounded-xl bg-background/50 border-border/60">
                        <SelectValue placeholder="Select Stage" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {stages.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="geography" className="text-sm font-semibold">Geography</Label>
                    <Select value={geography} onValueChange={setGeography}>
                      <SelectTrigger id="geography" className="h-11 rounded-xl bg-background/50 border-border/60">
                        <SelectValue placeholder="Select Geography" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {geographies.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="language" className="text-sm font-semibold">Report Generation Language</Label>
                    <Select value={reportLang} onValueChange={setReportLang as any}>
                      <SelectTrigger id="language" className="h-11 rounded-xl bg-background/50 border-border/60">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {generationLanguages.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing analysis...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Analyze Funding Fit
                  </>
                )}
              </Button>
            </motion.form>
          </div>

          <div className="lg:col-span-5 space-y-6 font-display">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-muted/30 border border-border/50 rounded-3xl p-8 space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground font-display">
                  <Info className="w-5 h-5 text-primary" />
                  How it works
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Our AI analysis engine processes your startup profile against millions of market data points.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Investor Matching</p>
                    <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">
                      "We match your startup with investors who have previously funded similar stages and sectors."
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Evidence-Backed</p>
                    <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">
                      "Every insight is correlated with real-world policy documents and market reports."
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Actionable Feedback</p>
                    <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">
                      "Get clear recommendations on how to improve your funding readiness."
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/40">
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                  <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Pro Tip</p>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Including details about your unique technology or business model significantly increases analysis accuracy.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
