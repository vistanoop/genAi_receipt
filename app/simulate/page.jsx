"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Simulation Lab Page
 * Test "what if I do this?" scenarios before making decisions
 * Simulation does NOT change real data unless confirmed
 */
export default function SimulatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [dateOffset, setDateOffset] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const handleSimulate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/simulate/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          dateOffset,
        }),
      });

      if (!response.ok) throw new Error('Simulation failed');
      
      const data = await response.json();
      setResult(data.simulation);
      toast.success('Simulation complete!');
    } catch (error) {
      console.error('Simulation error:', error);
      toast.error('Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  const clearSimulation = () => {
    setAmount("");
    setDateOffset(0);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-xl font-bold gradient-title">Simulation Lab</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Test Spending Decisions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how a purchase affects your month-end balance, risk level, and goals before you commit.
          </p>
        </motion.div>

        {/* Simulation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphism rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold mb-6">Spending Scenario</h3>
          <div className="space-y-6">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label>When?</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {[
                  { label: 'Today', value: 0 },
                  { label: 'In 3 days', value: 3 },
                  { label: 'In 1 week', value: 7 },
                  { label: 'In 2 weeks', value: 14 },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDateOffset(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      dateOffset === option.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-border hover:border-purple-500/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleSimulate}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? 'Simulating...' : 'Simulate Impact'}
              </Button>
              {result && (
                <Button
                  onClick={clearSimulation}
                  variant="outline"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Impact Summary */}
            <div className="glassmorphism rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Impact Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30">
                  <div className="text-sm text-muted-foreground mb-2">Month-End Balance Change</div>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    {result.impact?.balanceChange < 0 ? (
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    )}
                    <span className={result.impact?.balanceChange < 0 ? 'text-red-500' : 'text-green-500'}>
                      ₹{Math.abs(result.impact?.balanceChange || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {result.impact?.percentChange?.toFixed(1)}% change
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-2">Risk Level</div>
                  <div className="text-2xl font-bold">
                    {result.riskChange?.before} → {result.riskChange?.after}
                  </div>
                  {result.riskChange?.changed && (
                    <div className="flex items-center gap-2 mt-2 text-orange-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Risk increased</span>
                    </div>
                  )}
                </div>

                <div className="p-6 rounded-xl bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-2">Goals Delayed</div>
                  <div className="text-3xl font-bold">
                    {result.impact?.goalDaysDelayed || 0} days
                  </div>
                  {result.impact?.goalNames?.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Affects: {result.impact.goalNames.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Explanation */}
            {result.aiExplanation && (
              <div className="glassmorphism rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">AI Explanation</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {result.aiExplanation}
                </p>
              </div>
            )}

            {/* Recommendation */}
            {result.explanation?.recommendation && (
              <div className={`glassmorphism rounded-2xl p-8 border-2 ${
                result.explanation.recommendation.severity === 'high' ? 'border-red-500/50' :
                result.explanation.recommendation.severity === 'medium' ? 'border-yellow-500/50' :
                'border-green-500/50'
              }`}>
                <h3 className="text-xl font-bold mb-4">Recommendation</h3>
                <p className="text-lg font-semibold mb-2 capitalize">
                  {result.explanation.recommendation.action.replace(/_/g, ' ')}
                </p>
                <p className="text-muted-foreground">
                  Reason: {result.explanation.recommendation.reason.replace(/_/g, ' ')}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!result && (
          <div className="text-center text-muted-foreground py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Enter an amount and click "Simulate Impact" to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}
