import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Save, Sparkles, Languages } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { motion } from "motion/react";

const languages = [
  { value: "en", label: "English", native: "English", flag: "🇺🇸" },
  { value: "hi", label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { value: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { value: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { value: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { value: "mr", label: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { value: "gu", label: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { value: "kn", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
] as const;

export default function LanguageSettings() {
  const [reportLanguage, setReportLanguage] = useState("en");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Preferences Saved",
      description: `AI report generation language set to ${languages.find(l => l.value === reportLanguage)?.label}.`,
      className: "bg-primary text-primary-foreground border-none shadow-xl rounded-2xl",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full space-y-8 pb-8 font-display"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
              Output Language
            </h1>
            <p className="text-muted-foreground text-sm font-bold opacity-70">
              Customize the language for AI-generated market intelligence.
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="rounded-xl px-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 gap-2 font-black uppercase tracking-widest text-xs h-11 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-sm">
              <div className="space-y-3">
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
                  <Languages className="w-6 h-6 text-primary" />
                  AI Intelligence Output
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-bold opacity-80">
                  Select the default language for generated AI reports, strategic fits, and risk assessments.
                </p>
              </div>

              <div className="space-y-4">
                <Select value={reportLanguage} onValueChange={setReportLanguage}>
                  <SelectTrigger className="w-full h-16 rounded-2xl bg-background border-2 border-border/50 focus:ring-primary/20 font-black transition-all text-sm uppercase tracking-tight">
                    <SelectValue placeholder="Select Report Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/80 rounded-[1.5rem] shadow-2xl p-2">
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="rounded-xl my-1 p-3 cursor-pointer">
                        <span className="flex items-center gap-3">
                          <span className="text-2xl">{lang.flag}</span>
                          <span className="font-bold text-sm">{lang.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-6 rounded-3xl bg-primary/[0.04] border border-primary/20 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  Preserve Nuance
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-bold">
                  Our models are trained to maintain financial terminology and startup context across all supported regional languages.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="p-8 rounded-[2rem] bg-muted/40 border border-border/40 space-y-4 shadow-inner">
              <h4 className="font-black text-foreground text-sm uppercase tracking-tight flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Global Accessibility
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-bold opacity-70">
                While your workspace interface can be toggled via the sidebar, this setting specifically dictates the language used by our AI engine when synthesizing data points and generating outcomes.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] border border-dashed border-border/60 flex items-center justify-center text-center">
              <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest opacity-40 leading-relaxed">
                More languages and regional dialects<br />are being synchronized weekly.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
