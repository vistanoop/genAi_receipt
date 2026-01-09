/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  Globe,
  Settings,
  LogOut,
  TrendingUp,
  Moon,
  Sun,
  ChevronUp,
  Scale,
  ShieldAlert,
} from "lucide-react";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";
import { useToast } from "../../hooks/use-toast";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar";
import { cn } from "../../lib/utils";
import { useLanguage } from "../../contexts/LanguageContext";
import { supabase } from "../../utils/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", flag: "🇮🇳" },
  { code: "te", label: "Telugu", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", flag: "🇮🇳" },
] as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const { toast } = useToast();
  const [isDark, setIsDark] = React.useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Search, label: "Analyze", path: "/analyze" },
    { icon: ShieldAlert, label: "Fraud Check", path: "/fraud-detection" },
    { icon: Scale, label: "Intelligence Hub", path: "/intelligence-hub" },
    { icon: MessageSquare, label: "Q & A", path: "/chat" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "Successfully signed out. See you soon!",
        className:
          "bg-primary text-primary-foreground border-none shadow-xl rounded-2xl",
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      navigate("/");
    }
  };

  const currentLang =
    LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-12 flex items-center px-4 border-b border-sidebar-border/50">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 group"
          onClick={() => setOpenMobile(false)}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-black text-base tracking-tight group-data-[collapsible=icon]:hidden leading-none">
            Funding<span className="text-primary italic">Sense</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-4 pb-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    "h-11 px-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Link to={item.path} onClick={() => setOpenMobile(false)}>
                    <item.icon
                      className={cn("size-5", isActive && "text-primary")}
                    />
                    <span className="font-bold text-xs uppercase tracking-widest">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50 space-y-2">
        <SidebarMenu>
          {/* Language Selector */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Change Language"
                  className="h-11 px-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all group"
                >
                  <Globe className="size-5 group-hover:text-primary transition-colors" />
                  <div className="flex flex-1 items-center justify-between group-data-[collapsible=icon]:hidden">
                    <span className="font-bold text-xs uppercase tracking-widest">
                      {currentLang.label}
                    </span>
                    <ChevronUp className="size-3 h-4 w-4 opacity-50" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="right"
                className="w-56 p-2 rounded-2xl shadow-2xl border-border/50 backdrop-blur-xl bg-background/95 animate-in slide-in-from-left-2 duration-300"
              >
                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">
                  Language Settings
                </div>
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-1 group/item",
                      language === lang.code
                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                        : "hover:bg-muted font-bold text-foreground/60 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none transition-transform group-hover/item:scale-110">
                        {lang.flag}
                      </span>
                      <span className="text-xs uppercase tracking-wider">
                        {lang.label}
                      </span>
                    </div>
                    {language === lang.code && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip="Toggle Theme"
              className="h-11 px-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              {isDark ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
              <span className="font-bold text-xs uppercase tracking-widest">
                Theme
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsLogoutDialogOpen(true)}
              tooltip="Logout"
              className="h-11 px-3 rounded-xl text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/5"
            >
              <LogOut className="size-5" />
              <span className="font-bold text-xs uppercase tracking-widest">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
      <LogoutConfirmDialog
        isOpen={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={handleLogout}
      />
    </Sidebar>
  );
}
