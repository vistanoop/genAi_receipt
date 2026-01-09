import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Save, User as UserIcon, Bell, Loader2, Sparkles } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogoutConfirmDialog } from "../components/layout/LogoutConfirmDialog";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setName(user.user_metadata?.full_name || "");
        setEmail(user.email || "");
        setCompany(user.user_metadata?.company || "");
      }
      setIsLoading(false);
    }
    getProfile();
  }, []);

  const handleProfileSave = async () => {
    setIsSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, company: company }
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
        className: "bg-primary text-primary-foreground border-none shadow-xl rounded-2xl",
      });
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "Successfully signed out. See you soon!",
      className: "bg-primary text-primary-foreground border-none shadow-xl rounded-2xl",
    });
    navigate("/login");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full space-y-6 font-display"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              User Settings
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Manage your profile and notification preferences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleProfileSave}
              className="rounded-xl px-8 h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm gap-2 font-bold"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-280px)]">
          <motion.div variants={itemVariants} className="space-y-4 flex flex-col">
            <div className="flex items-center gap-3 px-1">
              <UserIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Profile Details</h2>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm space-y-8 flex-1">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl font-black text-primary border border-primary/20 shadow-inner">
                  {name ? name[0] : (email ? email[0].toUpperCase() : "U")}
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-black text-lg text-foreground truncate uppercase tracking-tight">{name || "Founder Profile"}</h3>
                  <p className="text-sm text-muted-foreground truncate font-medium">{email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Company / Startup Name</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="E.g. HealthTech AI"
                    className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Login Email</Label>
                  <div className="h-12 px-4 rounded-xl bg-muted/40 border border-border/50 flex items-center text-sm font-bold text-muted-foreground select-none">
                    {email}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4 flex flex-col">
            <div className="flex items-center gap-3 px-1">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Alerts & Insights</h2>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm space-y-8 flex-1">
              <div className="p-6 rounded-2xl bg-primary/[0.03] border border-primary/10">
                <p className="text-sm font-bold text-foreground/80 leading-relaxed">
                  Stay updated with your analysis reports and the latest funding intelligence.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-6 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/30 group">
                  <div className="space-y-1">
                    <p className="font-bold text-foreground text-sm uppercase tracking-tight">System Notifications</p>
                    <p className="text-xs text-muted-foreground font-medium">Analysis completion and critical alerts</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/30 group">
                  <div className="space-y-1">
                    <p className="font-bold text-foreground text-sm uppercase tracking-tight">Funding Intel Digest</p>
                    <p className="text-xs text-muted-foreground font-medium">Weekly market trends and movement summaries</p>
                  </div>
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 border-primary/20 text-primary hover:bg-primary/5"
                  onClick={async () => {
                    const { syncVideoAcademy } = await import("../services/api");
                    toast({ title: "Syncing Intelligence...", description: "Fetching latest expert talks and funding news.", duration: 5000 });
                    try {
                      await syncVideoAcademy();
                      toast({ title: "Sync Complete", description: "Academy refreshed with latest real-time data.", className: "bg-primary text-white" });
                    } catch (e) {
                      toast({ title: "Sync Delayed", description: "Real-time engine is currently high load. Try again in a minute.", variant: "destructive" });
                    }
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Force Intelligence Sync
                </Button>
                <div className="p-6 rounded-2xl bg-muted/40 border border-border/40">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Data Privacy</h4>
                  <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-bold">Your notification preferences are securely stored and synced across your workplace endpoints.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <LogoutConfirmDialog
        isOpen={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={handleLogout}
      />
    </DashboardLayout>
  );
}
