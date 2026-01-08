"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Calendar, TrendingDown, TrendingUp, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Cash-Flow Forecast Page - Future Prediction Engine
 * Shows end-of-month prediction and next 3 months timeline
 * NO AI chat here - pure forecasting
 */
export default function ForecastPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [nextMonths, setNextMonths] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchForecast();
    fetchTimeline();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchForecast = async () => {
    try {
      const response = await fetch('/api/forecast/current-month');
      if (!response.ok) throw new Error('Failed to fetch forecast');
      const data = await response.json();
      setForecast(data.forecast);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      toast.error('Failed to load forecast');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const response = await fetch('/api/forecast/timeline');
      if (!response.ok) throw new Error('Failed to fetch timeline');
      const data = await response.json();
      setTimeline(data.timeline || []);
      setNextMonths(data.nextMonths || []);
    } catch (error) {
      console.error('Error fetching timeline:', error);
    }
  };

  const getRiskZone = (balance) => {
    if (!user) return 'safe';
    const threshold = user.minimumBalanceThreshold || 5000;
    if (balance < threshold) return 'danger';
    if (balance < threshold * 2) return 'warning';
    return 'safe';
  };

  const getRiskColor = (zone) => {
    switch (zone) {
      case 'danger': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading forecast...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold gradient-title">Cash-Flow Forecast</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* End of Month Prediction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">End-of-Month Prediction</h2>
              <p className="text-sm text-muted-foreground">Based on your current spending pattern</p>
            </div>
          </div>

          {forecast && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-muted/50">
                <div className="text-sm text-muted-foreground mb-2">Current Balance</div>
                <div className="text-3xl font-bold">₹{forecast.currentBalance?.toLocaleString() || '0'}</div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30">
                <div className="text-sm text-muted-foreground mb-2">Predicted End Balance</div>
                <div className={`text-3xl font-bold ${getRiskColor(getRiskZone(forecast.predictedEndBalance))}`}>
                  ₹{forecast.predictedEndBalance?.toLocaleString() || '0'}
                </div>
                {forecast.predictedEndBalance < (user?.minimumBalanceThreshold || 5000) && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Below safety threshold</span>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-xl bg-muted/50">
                <div className="text-sm text-muted-foreground mb-2">Burn Rate</div>
                <div className="text-2xl font-bold">{forecast.burnRate?.burnRatio ? (forecast.burnRate.burnRatio * 100).toFixed(0) : '0'}%</div>
                <div className="text-xs text-muted-foreground mt-1">of monthly income</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Timeline Graph */}
        {timeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glassmorphism rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Day-by-Day Timeline</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline}>
                  <XAxis 
                    dataKey="day" 
                    label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Balance (₹)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <ReferenceLine 
                    y={user?.minimumBalanceThreshold || 5000} 
                    stroke="red" 
                    strokeDasharray="3 3"
                    label="Safety Threshold"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Next 3 Months */}
        {nextMonths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Next 3 Months Projection</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nextMonths.map((month, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl border-2 border-border hover:border-teal-500/50 transition-colors"
                >
                  <div className="text-sm font-semibold text-muted-foreground mb-4">Month {month.month}</div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Income</span>
                      <span className="font-semibold text-green-500">+₹{month.expectedIncome?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fixed Expenses</span>
                      <span className="font-semibold text-red-500">-₹{month.fixedExpenses?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Variable Expenses</span>
                      <span className="font-semibold text-orange-500">-₹{month.variableExpenses?.toLocaleString()}</span>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between">
                      <span className="text-sm font-semibold">Predicted Balance</span>
                      <span className={`font-bold ${getRiskColor(getRiskZone(month.predictedBalance))}`}>
                        ₹{month.predictedBalance?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/simulate">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Test Spending Decisions
            </Button>
          </Link>
          <Link href="/advisor">
            <Button size="lg" variant="outline">
              Ask AI About This
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
