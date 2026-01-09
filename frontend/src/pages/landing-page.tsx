/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle,
  Globe,
  Lightbulb,
  ArrowRight,
  LogOut,
  Settings as SettingsIcon,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { supabase } from "../utils/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";

const features = [
  {
    icon: CheckCircle,
    title: "Evidence-Backed Decisions",
    description: "Every recommendation is backed by real funding data, policy documents, and market intelligence.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Full support for Indic languages, making funding intelligence accessible to founders across India.",
  },
  {
    icon: Lightbulb,
    title: "Explainable AI Insights",
    description: "Understand exactly why a funding outcome is predicted. No black boxes, complete transparency.",
  },
];

const GridBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
  </div>
);

export default function Landing() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/10">
      <GridBackground />


      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Funding<span className="text-primary">Sense</span>
            </span>
          </Link>


          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-sm font-medium">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 flex items-center justify-center ring-1 ring-border overflow-hidden">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-[10px] bg-muted">{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-xs font-medium leading-none truncate">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/settings")} className="text-xs cursor-pointer">
                      <SettingsIcon className="mr-2 h-3.5 w-3.5" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-xs text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-3.5 w-3.5" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-sm font-medium">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white px-4 h-9 rounded-lg transition-all shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>


          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>


      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-lg md:hidden p-6"
          >
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                    <LayoutDashboard className="w-5 h-5 text-primary" />
                    <span className="font-medium text-lg">Dashboard</span>
                  </Link>
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                    <SettingsIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-lg">Settings</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors text-left">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-lg">Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-12 text-lg rounded-xl">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full h-12 text-lg rounded-xl bg-primary">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>

        <section className="pt-32 md:pt-40 pb-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">
                AI Funding Analyst
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.2] md:leading-[1.1] tracking-tight text-balance">
                Make your next funding round <br />
                <span className="text-primary">data-driven and decisive.</span>
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Analyze your project's funding potential with evidence-backed AI insights.
                Derived from millions of data points to give you the competitive edge.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link to={user ? "/analyze" : "/signup"} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white text-base font-medium shadow-lg shadow-primary/20 transition-all active:scale-95">
                    Start Analysis
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>

                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-base font-medium backdrop-blur-sm transition-all active:scale-95">
                    View Demo Dashboard
                  </Button>
                </Link>

              </div>
            </motion.div>
          </div>
        </section>


        <section className="py-20 md:py-24 px-6 border-t border-border/40">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i} className="space-y-4 p-6 rounded-2xl border border-transparent sm:hover:border-border/60 sm:hover:bg-muted/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-3xl text-center space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              Ready to scale your startup?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Join founders who use FundingSense to understand their market position
              and improve their funding success rate.
            </p>
            <Link to={user ? "/analyze" : "/signup"} className="inline-block">
              <Button size="lg" className="h-12 px-10 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-border/40">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-bold">FundingSense</span>
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            © 2026 FundingSense AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] md:text-xs text-muted-foreground">
            <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
