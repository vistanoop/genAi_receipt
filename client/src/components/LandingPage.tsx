import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, TestTube, ChevronRight } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-[#0a0f1c] font-sans text-white selection:bg-green-500/30 overflow-y-scroll snap-y snap-mandatory h-screen no-scrollbar">

            {/* First Screen */}
            <section className="h-screen w-full flex flex-col items-center justify-center snap-start relative overflow-hidden">

                <div className="flex flex-col items-center justify-center z-10 w-full px-4 text-center">
                    <h1 className="text-[15vw] leading-none font-black tracking-tighter select-none">
                        <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-800 bg-[length:200%_auto] animate-gradient-flow bg-clip-text text-transparent filter drop-shadow-2xl">
                            AgriScoreX
                        </span>
                    </h1>
                    <p className="text-xl md:text-3xl text-gray-400 font-light tracking-[0.2em] uppercase mt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Cultivating Credit Trust
                    </p>
                </div>

                {/* Subtle background glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Scroll hint */}
                <div className="absolute bottom-10 animate-bounce text-gray-500/50">
                    <span className="text-sm uppercase tracking-widest">Scroll Down</span>
                </div>
            </section>

            {/* Second Screen */}
            <section className="min-h-screen w-full flex items-center justify-center p-6 md:p-12 snap-start bg-[#0a0f1c]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

                    {/* API Block */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <Card
                            className="relative h-full flex flex-col justify-between bg-[#161b2c] border-white/5 hover:border-white/10 transition-all duration-300 rounded-3xl overflow-hidden p-2"
                            onClick={() => window.open(`${import.meta.env.VITE_API_URL}/docs`, '_blank', 'noopener,noreferrer')}
                        >
                            <CardHeader className="space-y-4 p-6 sm:p-8 text-left">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-green-900/20 border border-green-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                                    <Code className="w-7 h-7 text-green-400" />
                                </div>
                                <div className="space-y-2">
                                    <CardTitle className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors">API Access</CardTitle>
                                    <CardDescription className="text-gray-400 text-lg leading-relaxed text-left">
                                        Empower your financial platform with our robust credit scoring engine. Seamlessly integrate advanced agricultural risk assessment models directly into your workflow with just a few lines of code.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8 pt-0 mt-auto">
                                <div className="flex items-center text-white/50 font-medium group-hover:text-white transition-colors cursor-pointer text-sm tracking-wide uppercase">
                                    View Documentation <ChevronRight className="ml-1 w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Eligibility Test Block */}
                    <div
                        onClick={() => navigate("/dashboard")}
                        className="group relative cursor-pointer"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-green-300/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <Card className="relative h-full flex flex-col justify-between bg-[#161b2c] border-white/5 hover:border-white/10 transition-all duration-300 rounded-3xl overflow-hidden p-2">
                            <CardHeader className="space-y-4 p-6 sm:p-8 text-left">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-green-900/20 border border-green-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                                    <TestTube className="w-7 h-7 text-green-400" />
                                </div>
                                <div className="space-y-2">
                                    <CardTitle className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors">Eligibility Test</CardTitle>
                                    <CardDescription className="text-gray-400 text-lg leading-relaxed text-left">
                                        Instantly analyze farmer creditworthiness using our AI-driven assessment tool. Input key agricultural metrics and receive immediate validation, risk scoring, and authorized loan limits.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8 pt-0 mt-auto">
                                <div className="flex items-center text-white/50 font-medium group-hover:text-white transition-colors text-sm tracking-wide uppercase">
                                    Start Assessment <ChevronRight className="ml-1 w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </section>
        </div>
    );
}
