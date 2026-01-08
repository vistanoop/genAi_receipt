"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, Wallet, Target, Shield, TrendingUp } from "lucide-react";

/**
 * Onboarding Page - First Login Only
 * Collects financial context and user-defined rules
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    monthlyIncome: "",
    currency: "INR",
    minimumBalanceThreshold: "",
    monthlySavingsFloor: "",
    riskTolerance: "medium",
  });

  useEffect(() => {
    // Check if user is authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      // If onboarding already completed, redirect to dashboard
      if (data.user?.onboardingCompleted) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate safety buffers if income changes
    if (field === 'monthlyIncome' && value) {
      const income = parseFloat(value);
      if (income > 0) {
        setFormData(prev => ({
          ...prev,
          minimumBalanceThreshold: prev.minimumBalanceThreshold || (income * 0.1).toString(),
          monthlySavingsFloor: prev.monthlySavingsFloor || (income * 0.1).toString(),
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
      toast.error('Please enter a valid monthly income');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyIncome: parseFloat(formData.monthlyIncome),
          currency: formData.currency,
          minimumBalanceThreshold: parseFloat(formData.minimumBalanceThreshold) || parseFloat(formData.monthlyIncome) * 0.1,
          monthlySavingsFloor: parseFloat(formData.monthlySavingsFloor) || parseFloat(formData.monthlyIncome) * 0.1,
          riskTolerance: formData.riskTolerance,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save onboarding data');
      }

      toast.success('Onboarding completed! Welcome to FlowCast 🎉');
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error(error.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0)) {
      toast.error('Please enter your monthly income');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-600/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="glassmorphism rounded-2xl p-8 md:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome to <span className="gradient-title">FlowCast</span>
            </h1>
            <p className="text-muted-foreground">
              Let&apos;s set up your financial profile. This takes 2 minutes.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s <= step ? 'bg-gradient-to-r from-teal-500 to-blue-500' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Income */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Basic Information</h2>
                    <p className="text-sm text-muted-foreground">Your income and currency</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="50000"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                      className="mt-2"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your total monthly income after taxes
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="currency">Preferred Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleChange('currency', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                >
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Safety Buffers */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Safety Buffers</h2>
                    <p className="text-sm text-muted-foreground">Your personal safety rules</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="minimumBalance">Minimum Balance Threshold</Label>
                    <Input
                      id="minimumBalance"
                      type="number"
                      placeholder="5000"
                      value={formData.minimumBalanceThreshold}
                      onChange={(e) => handleChange('minimumBalanceThreshold', e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your account should never go below this amount
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="savingsFloor">Monthly Savings Floor</Label>
                    <Input
                      id="savingsFloor"
                      type="number"
                      placeholder="5000"
                      value={formData.monthlySavingsFloor}
                      onChange={(e) => handleChange('monthlySavingsFloor', e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum amount you want to save each month
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Next <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Risk Tolerance */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Risk Comfort Level</h2>
                    <p className="text-sm text-muted-foreground">How you handle financial risk</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Risk Tolerance</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'low', label: 'Low', desc: 'Very cautious' },
                      { value: 'medium', label: 'Medium', desc: 'Balanced' },
                      { value: 'high', label: 'High', desc: 'Comfortable with risk' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange('riskTolerance', option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.riskTolerance === option.value
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-border hover:border-teal-500/50'
                        }`}
                      >
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This affects how FlowCast evaluates your spending decisions
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {loading ? 'Saving...' : 'Complete Setup'} <Target className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Skip Link */}
          {step < 3 && (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip to final step →
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
