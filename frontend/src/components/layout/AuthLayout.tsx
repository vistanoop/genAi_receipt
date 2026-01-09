import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, CheckCircle2, Star, Zap } from "lucide-react";
import { motion } from "motion/react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted/30 border-r border-border/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--tw-gradient-from)_0%,transparent_50%)] from-primary/5 opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,var(--tw-gradient-from)_0%,transparent_50%)] from-emerald-500/5 opacity-50" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-display font-black tracking-tight">
              Funding<span className="text-primary italic">Sense</span>
            </span>
          </Link>

          <div className="space-y-12 max-w-lg">
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-5xl font-display font-black text-foreground leading-[1.1] tracking-tight"
              >
                The Elite Standard for <br />
                <span className="text-primary">Startup Intelligence.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-lg text-muted-foreground leading-relaxed font-medium"
              >
                Join thousands of founders using evidence-backed AI insights to scale their ventures and secure capital.
              </motion.p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-col gap-4">
              {[
                { icon: CheckCircle2, text: "99% Data Accuracy", color: "text-emerald-500" },
                { icon: Star, text: "Top Tier VC Insights", color: "text-amber-500" },
                { icon: Zap, text: "Real-time Growth Metrics", color: "text-primary" }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-background/50 backdrop-blur-md border border-border/40 shadow-sm w-fit group hover:border-primary/30 transition-colors"
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="font-bold text-sm tracking-tight">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            <span>© 2026 FundingSense</span>
          </div>
        </div>


        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-primary/5 blur-[100px]"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-hidden">
        <div className="lg:hidden absolute top-12 left-1/2 -translate-x-1/2">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-black tracking-tight">FundingSense</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm space-y-10"
        >
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-3xl font-display font-black tracking-tight text-foreground">{title}</h2>
            <p className="text-muted-foreground font-medium text-sm">{subtitle}</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
