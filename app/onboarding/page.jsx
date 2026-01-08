"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // State for all onboarding data
  const [fixedExpenses, setFixedExpenses] = useState([
    { name: "", amount: "", dayOfMonth: "1", category: "housing" },
  ]);

  const [variableExpenseCategories, setVariableExpenseCategories] = useState([
    { name: "", monthlyBudget: "", category: "groceries" },
  ]);

  const [savingsGoals, setSavingsGoals] = useState([
    { name: "", targetAmount: "", monthlyContribution: "", targetDate: "", priority: "medium", type: "short-term" },
  ]);

  const [riskTolerance, setRiskTolerance] = useState("medium");
  
  const [safetyBuffers, setSafetyBuffers] = useState({
    minimumBalance: "10000",
    monthlySavingsFloor: "5000",
    emergencyFundTarget: "50000",
  });

  const totalSteps = 5;

  // Add/Remove handlers
  const addFixedExpense = () => {
    setFixedExpenses([...fixedExpenses, { name: "", amount: "", dayOfMonth: "1", category: "housing" }]);
  };

  const removeFixedExpense = (index) => {
    setFixedExpenses(fixedExpenses.filter((_, i) => i !== index));
  };

  const addVariableExpense = () => {
    setVariableExpenseCategories([...variableExpenseCategories, { name: "", monthlyBudget: "", category: "groceries" }]);
  };

  const removeVariableExpense = (index) => {
    setVariableExpenseCategories(variableExpenseCategories.filter((_, i) => i !== index));
  };

  const addSavingsGoal = () => {
    setSavingsGoals([...savingsGoals, { name: "", targetAmount: "", monthlyContribution: "", targetDate: "", priority: "medium", type: "short-term" }]);
  };

  const removeSavingsGoal = (index) => {
    setSavingsGoals(savingsGoals.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Filter out empty entries
      const validFixedExpenses = fixedExpenses.filter(e => e.name && e.amount);
      const validVariableExpenses = variableExpenseCategories.filter(e => e.name && e.monthlyBudget);
      const validSavingsGoals = savingsGoals.filter(g => g.name && g.targetAmount && g.monthlyContribution && g.targetDate);

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fixedExpenses: validFixedExpenses.map(e => ({
            ...e,
            amount: parseFloat(e.amount),
            dayOfMonth: parseInt(e.dayOfMonth),
          })),
          variableExpenseCategories: validVariableExpenses.map(e => ({
            ...e,
            monthlyBudget: parseFloat(e.monthlyBudget),
          })),
          savingsGoals: validSavingsGoals.map(g => ({
            ...g,
            targetAmount: parseFloat(g.targetAmount),
            monthlyContribution: parseFloat(g.monthlyContribution),
          })),
          riskTolerance,
          safetyBuffers: {
            minimumBalance: parseFloat(safetyBuffers.minimumBalance),
            monthlySavingsFloor: parseFloat(safetyBuffers.monthlySavingsFloor),
            emergencyFundTarget: parseFloat(safetyBuffers.emergencyFundTarget),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to complete onboarding');
        setLoading(false);
        return;
      }

      toast.success('Onboarding completed successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card rounded-2xl p-8 shadow-lg"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1">
                <h2 className="text-2xl font-bold mb-4">Welcome to FlowCast! 👋</h2>
                <p className="text-muted-foreground mb-6">
                  Let's set up your financial profile. This helps us predict your cash flow and provide personalized recommendations.
                  All information is confidential and stored securely.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <Check className="w-5 h-5 text-teal-500" />
                    <span className="text-sm">We'll never share your data</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <Check className="w-5 h-5 text-teal-500" />
                    <span className="text-sm">All predictions are based on your rules</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <Check className="w-5 h-5 text-teal-500" />
                    <span className="text-sm">You can update anytime in settings</span>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2">
                <h2 className="text-2xl font-bold mb-2">Fixed Monthly Expenses</h2>
                <p className="text-muted-foreground mb-6">
                  Rent, EMIs, subscriptions, insurance - anything that's the same amount every month.
                </p>
                <div className="space-y-4">
                  {fixedExpenses.map((expense, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-4">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                          placeholder="Rent"
                          value={expense.name}
                          onChange={(e) => {
                            const updated = [...fixedExpenses];
                            updated[index].name = e.target.value;
                            setFixedExpenses(updated);
                          }}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <Input
                          type="number"
                          placeholder="15000"
                          value={expense.amount}
                          onChange={(e) => {
                            const updated = [...fixedExpenses];
                            updated[index].amount = e.target.value;
                            setFixedExpenses(updated);
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Day</label>
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          value={expense.dayOfMonth}
                          onChange={(e) => {
                            const updated = [...fixedExpenses];
                            updated[index].dayOfMonth = e.target.value;
                            setFixedExpenses(updated);
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                          value={expense.category}
                          onChange={(e) => {
                            const updated = [...fixedExpenses];
                            updated[index].category = e.target.value;
                            setFixedExpenses(updated);
                          }}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="housing">Housing</option>
                          <option value="utilities">Utilities</option>
                          <option value="insurance">Insurance</option>
                          <option value="emi">EMI</option>
                          <option value="subscription">Subscription</option>
                          <option value="other-fixed">Other</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        {fixedExpenses.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFixedExpense(index)}
                            className="h-10 px-2"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFixedExpense} className="w-full">
                    + Add Another Fixed Expense
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3">
                <h2 className="text-2xl font-bold mb-2">Variable Expense Categories</h2>
                <p className="text-muted-foreground mb-6">
                  Food, travel, shopping - expenses that vary month to month. Set your target budget for each.
                </p>
                <div className="space-y-4">
                  {variableExpenseCategories.map((expense, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <label className="block text-sm font-medium mb-1">Category Name</label>
                        <Input
                          placeholder="Groceries"
                          value={expense.name}
                          onChange={(e) => {
                            const updated = [...variableExpenseCategories];
                            updated[index].name = e.target.value;
                            setVariableExpenseCategories(updated);
                          }}
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium mb-1">Monthly Budget</label>
                        <Input
                          type="number"
                          placeholder="8000"
                          value={expense.monthlyBudget}
                          onChange={(e) => {
                            const updated = [...variableExpenseCategories];
                            updated[index].monthlyBudget = e.target.value;
                            setVariableExpenseCategories(updated);
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                          value={expense.category}
                          onChange={(e) => {
                            const updated = [...variableExpenseCategories];
                            updated[index].category = e.target.value;
                            setVariableExpenseCategories(updated);
                          }}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="groceries">Groceries</option>
                          <option value="food">Food</option>
                          <option value="transportation">Transport</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="shopping">Shopping</option>
                          <option value="travel">Travel</option>
                          <option value="other-variable">Other</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        {variableExpenseCategories.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariableExpense(index)}
                            className="h-10 px-2"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addVariableExpense} className="w-full">
                    + Add Another Category
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4">
                <h2 className="text-2xl font-bold mb-2">Savings Goals</h2>
                <p className="text-muted-foreground mb-6">
                  What are you saving for? Emergency fund, vacation, house down payment?
                </p>
                <div className="space-y-4">
                  {savingsGoals.map((goal, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Goal Name</label>
                          <Input
                            placeholder="Emergency Fund"
                            value={goal.name}
                            onChange={(e) => {
                              const updated = [...savingsGoals];
                              updated[index].name = e.target.value;
                              setSavingsGoals(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Target Amount</label>
                          <Input
                            type="number"
                            placeholder="100000"
                            value={goal.targetAmount}
                            onChange={(e) => {
                              const updated = [...savingsGoals];
                              updated[index].targetAmount = e.target.value;
                              setSavingsGoals(updated);
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Monthly Contribution</label>
                          <Input
                            type="number"
                            placeholder="5000"
                            value={goal.monthlyContribution}
                            onChange={(e) => {
                              const updated = [...savingsGoals];
                              updated[index].monthlyContribution = e.target.value;
                              setSavingsGoals(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Target Date</label>
                          <Input
                            type="date"
                            value={goal.targetDate}
                            onChange={(e) => {
                              const updated = [...savingsGoals];
                              updated[index].targetDate = e.target.value;
                              setSavingsGoals(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Priority</label>
                          <select
                            value={goal.priority}
                            onChange={(e) => {
                              const updated = [...savingsGoals];
                              updated[index].priority = e.target.value;
                              setSavingsGoals(updated);
                            }}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <select
                          value={goal.type}
                          onChange={(e) => {
                            const updated = [...savingsGoals];
                            updated[index].type = e.target.value;
                            setSavingsGoals(updated);
                          }}
                          className="w-48 h-10 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="emergency">Emergency Fund</option>
                          <option value="short-term">Short-term Goal</option>
                          <option value="long-term">Long-term Goal</option>
                        </select>
                        {savingsGoals.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSavingsGoal(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addSavingsGoal} className="w-full">
                    + Add Another Goal
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5">
                <h2 className="text-2xl font-bold mb-2">Safety Buffers & Risk Tolerance</h2>
                <p className="text-muted-foreground mb-6">
                  Set your financial safety nets. These are YOUR rules, not ours.
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
                    <p className="text-xs text-muted-foreground mb-3">How comfortable are you with financial risk?</p>
                    <div className="grid grid-cols-3 gap-3">
                      {['low', 'medium', 'high'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setRiskTolerance(level)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            riskTolerance === level
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                              : 'border-border hover:border-teal-300'
                          }`}
                        >
                          <div className="font-medium capitalize">{level}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Minimum Balance Threshold</label>
                      <Input
                        type="number"
                        placeholder="10000"
                        value={safetyBuffers.minimumBalance}
                        onChange={(e) => setSafetyBuffers({...safetyBuffers, minimumBalance: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Never let your balance fall below this</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Savings Floor</label>
                      <Input
                        type="number"
                        placeholder="5000"
                        value={safetyBuffers.monthlySavingsFloor}
                        onChange={(e) => setSafetyBuffers({...safetyBuffers, monthlySavingsFloor: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Minimum amount to save each month</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Emergency Fund Target</label>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={safetyBuffers.emergencyFundTarget}
                        onChange={(e) => setSafetyBuffers({...safetyBuffers, emergencyFundTarget: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Your safety net for emergencies</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={step === 1 ? () => router.push('/') : handleBack}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-teal-500 to-blue-500"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-teal-500 to-blue-500"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
