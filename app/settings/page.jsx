"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Settings as SettingsIcon, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Settings Page
 * Update user preferences, income, safety buffers, and risk tolerance
 */
export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    monthlyIncome: "",
    currency: "INR",
    minimumBalanceThreshold: "",
    monthlySavingsFloor: "",
    riskTolerance: "medium",
  });

  useEffect(() => {
    checkAuth();
    fetchProfile();
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

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data.profile);
      setFormData({
        name: data.profile.name || "",
        monthlyIncome: data.profile.monthlyIncome?.toString() || "",
        currency: data.profile.currency || "INR",
        minimumBalanceThreshold: data.profile.minimumBalanceThreshold?.toString() || "",
        monthlySavingsFloor: data.profile.monthlySavingsFloor?.toString() || "",
        riskTolerance: data.profile.riskTolerance || "medium",
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          monthlyIncome: parseFloat(formData.monthlyIncome),
          currency: formData.currency,
          minimumBalanceThreshold: parseFloat(formData.minimumBalanceThreshold),
          monthlySavingsFloor: parseFloat(formData.monthlySavingsFloor),
          riskTolerance: formData.riskTolerance,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const data = await response.json();
      setProfile(data.profile);
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-xl font-bold gradient-title">Settings</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <p className="text-sm text-muted-foreground">Update your financial profile and preferences</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
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

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Safety Buffers (Your Rules)</h3>
              <p className="text-sm text-muted-foreground">
                These are YOUR personal safety thresholds. FlowCast uses these to evaluate risk.
              </p>

              <div>
                <Label htmlFor="minimumBalance">Minimum Balance Threshold</Label>
                <Input
                  id="minimumBalance"
                  type="number"
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
                  value={formData.monthlySavingsFloor}
                  onChange={(e) => handleChange('monthlySavingsFloor', e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum amount you want to save each month
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Risk Tolerance</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'low', label: 'Low', desc: 'Very cautious' },
                  { value: 'medium', label: 'Medium', desc: 'Balanced' },
                  { value: 'high', label: 'High', desc: 'Risk-comfortable' },
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
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
