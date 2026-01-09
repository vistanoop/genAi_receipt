import { type ReactNode } from "react";
import { SidebarProvider, SidebarInset, useSidebar } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { motion } from "motion/react";
import { TrendingUp, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { NotificationBell } from "./NotificationBell";

interface DashboardLayoutProps {
  children: ReactNode;
}

function CustomSidebarTrigger() {
  const { toggleSidebar, state, openMobile, isMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : state === "expanded";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-lg border border-border/50 hover:bg-muted transition-all active:scale-95 group relative flex items-center justify-center"
      onClick={toggleSidebar}
    >
      <motion.div
        animate={{
          rotate: isOpen ? 90 : 0,
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="grid grid-cols-2 gap-[2px]"
      >
        <div className="w-1.5 h-1.5 bg-foreground/80 rounded-[1px]" />
        <div className="w-1.5 h-1.5 bg-foreground/80 rounded-[1px]" />
        <div className="w-1.5 h-1.5 bg-foreground/80 rounded-[1px]" />
        <div className="w-1.5 h-1.5 bg-foreground/80 rounded-[1px]" />
      </motion.div>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/20 transition-colors duration-500 grainy">
        <AppSidebar />

        <SidebarInset className="flex flex-col">
          {/* Top Navbar / Mobile Header */}
          <header className="flex h-12 shrink-0 items-center justify-between px-4 md:px-6 border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-40">
            <div className="flex items-center gap-4">
              <CustomSidebarTrigger />
              <div className="h-4 w-px bg-border/40 hidden md:block" />
            </div>

            {/* Mobile-only Logo */}
            <Link to="/dashboard" className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <NotificationBell />
              <div className="h-4 w-px bg-border/40 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-xl border border-border/40 hover:bg-muted transition-all"
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </header>

          <main className="flex-1 pt-6 px-3 md:px-5 relative overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[180px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[1600px] mx-auto"
            >
              {children}
            </motion.div>
          </main>
        </SidebarInset>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.15);
        }
      `}</style>
    </SidebarProvider>
  );
}
