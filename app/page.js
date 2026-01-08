"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Shield, 
  Zap,
  Target,
  LineChart,
  Brain
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Landing Page - Marketing + Onboarding Only
 * NO analytics, NO charts, NO calculations, NO user data
 */
export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-600/10 dark:from-teal-500/5 dark:via-blue-500/5 dark:to-purple-600/5 animate-gradient" />
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-80 h-80 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-foreground/80">
                AI-Powered Financial Intelligence
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              Understand your financial future
              <br />
              <span className="gradient-title">before it happens</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              FlowCast predicts your end-of-month balance, simulates spending decisions, and explains why month-end struggles happen. Make better financial decisions with AI-powered insights.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 text-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 button-glow group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 text-lg border-2 hover:bg-muted"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border">
                <Shield className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Real-time Predictions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">AI-Powered Insights</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why <span className="gradient-title">Month-End Struggle</span> Happens
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              You make spending decisions based only on current balance, not understanding how today&apos;s choices affect tomorrow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                problem: "Blind Spot",
                description: "You don't see how today's ₹5,000 spending affects your end-of-month balance.",
                icon: Shield,
              },
              {
                problem: "Goal Disconnect",
                description: "You don't know if a purchase will delay your savings goals by days or months.",
                icon: Target,
              },
              {
                problem: "No Visibility",
                description: "You can't test 'what if I buy this?' before making the decision.",
                icon: LineChart,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glassmorphism rounded-2xl p-8 card-hover"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">{item.problem}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-title">FlowCast</span> Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand your financial future
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Cash-Flow Forecast",
                description: "See your predicted end-of-month balance and next 3 months projection.",
                icon: LineChart,
                gradient: "from-teal-500 to-blue-500",
              },
              {
                title: "Simulation Lab",
                description: "Test 'what if I buy this?' scenarios before making decisions.",
                icon: Sparkles,
                gradient: "from-blue-500 to-purple-500",
              },
              {
                title: "AI Financial Copilot",
                description: "Ask questions like 'Can I afford this?' and get AI-powered explanations.",
                icon: Brain,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                title: "Smart Dashboard",
                description: "Track your current balance, expenses, and savings progress.",
                icon: TrendingUp,
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                title: "Savings Goals",
                description: "Set goals and see how spending decisions delay or accelerate them.",
                icon: Target,
                gradient: "from-orange-500 to-red-500",
              },
              {
                title: "User-Defined Rules",
                description: "Set your own safety buffers, thresholds, and risk tolerance.",
                icon: Shield,
                gradient: "from-indigo-500 to-blue-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glassmorphism rounded-2xl p-8 card-hover"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to see your financial <span className="gradient-title">future</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join FlowCast today and start making better financial decisions with AI-powered insights.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl text-lg px-8 py-6 button-glow"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-title">Track Your Finances</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you understand and manage your money better
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Complete Onboarding",
                description:
                  "Set your income, fixed expenses, savings goals, and safety buffers. All rules are yours to define.",
                icon: Target,
                gradient: "from-teal-500 to-blue-500",
              },
              {
                step: "02",
                title: "Track & Forecast",
                description:
                  "Dashboard shows current state. Forecast page predicts your end-of-month balance using your spending patterns.",
                icon: LineChart,
                gradient: "from-blue-500 to-purple-500",
              },
              {
                step: "03",
                title: "Simulate & Decide",
                description:
                  "Use Simulation Lab to test spending decisions. Get AI explanations for every recommendation.",
                icon: Sparkles,
                title: "AI Receipt Scanner",
                description:
                  "Scan receipts instantly with AI. Automatically extract amounts, categories, and dates with high accuracy.",
                icon: Receipt,
                gradient: "from-teal-500 to-blue-500",
              },
              {
                title: "Expense Tracking",
                description:
                  "Track all your expenses in one place. Add, edit, and delete expenses easily with a clean interface.",
                icon: DollarSign,
                gradient: "from-blue-500 to-purple-500",
              },
              {
                title: "Visual Analytics",
                description:
                  "See your spending patterns with beautiful charts and graphs. Understand where your money goes.",
                icon: PieChart,
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="glassmorphism rounded-2xl p-8 h-full card-hover">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <span className="text-xl font-bold gradient-title">FlowCast</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FlowCast. AI-Powered Expense Management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
