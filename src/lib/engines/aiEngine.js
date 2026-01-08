/**
 * AI Explanation Layer
 * Converts structured backend data into natural language explanations
 * AI NEVER calculates - it only explains numbers from backend engines
 */

export class AIExplanationEngine {
  constructor(geminiApiKey) {
    this.apiKey = geminiApiKey;
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  /**
   * Explain simulation impact in natural language
   */
  async explainSimulationImpact(simulationResult, userContext) {
    const prompt = this.buildSimulationPrompt(simulationResult, userContext);
    return await this.callGemini(prompt);
  }

  /**
   * Explain recommendation in natural language
   */
  async explainRecommendation(recommendation, userContext) {
    const prompt = this.buildRecommendationPrompt(recommendation, userContext);
    return await this.callGemini(prompt);
  }

  /**
   * Answer user question about their finances
   */
  async answerFinancialQuestion(question, financialContext) {
    const prompt = this.buildQuestionPrompt(question, financialContext);
    return await this.callGemini(prompt);
  }

  /**
   * Explain why user runs out of money
   */
  async explainMoneyShortfall(analysisData) {
    const prompt = `
You are a supportive financial advisor. Explain in simple, empathetic language why the user is running out of money.

Financial Data (DO NOT RECALCULATE, JUST EXPLAIN):
- Monthly Income: ₹${analysisData.monthlyIncome}
- Total Expenses: ₹${analysisData.totalExpenses}
- Fixed Expenses: ₹${analysisData.fixedExpenses}
- Variable Expenses: ₹${analysisData.variableExpenses}
- Predicted End Balance: ₹${analysisData.predictedEndBalance}
- Days Until Month End: ${analysisData.daysRemaining}

Top Spending Categories:
${analysisData.topCategories.map(cat => `- ${cat.category}: ₹${cat.amount}`).join('\n')}

Guidelines:
1. Be empathetic and non-judgmental
2. Explain the pattern you see in their spending
3. Use simple language, no financial jargon
4. Focus on the biggest impact areas
5. Keep response under 200 words
6. Use the exact numbers provided above

Respond in a warm, conversational tone.
`;

    return await this.callGemini(prompt);
  }

  /**
   * Build simulation explanation prompt
   */
  buildSimulationPrompt(simulationResult, userContext) {
    return `
You are a financial advisor helping a user understand the impact of a spending decision.

Structured Data from Backend (DO NOT RECALCULATE):
- Current Balance: ₹${simulationResult.baseline.currentBalance}
- Balance After Spending: ₹${simulationResult.simulated.predictedEndBalance}
- Balance Change: ₹${simulationResult.impact.balanceChange}
- Percent Change: ${simulationResult.impact.percentChange.toFixed(1)}%
- Risk Level Before: ${simulationResult.riskChange.before}
- Risk Level After: ${simulationResult.riskChange.after}
- Goals Delayed: ${simulationResult.impact.goalDaysDelayed} days
- Affected Goals: ${simulationResult.impact.goalNames.join(', ') || 'None'}

User Context:
- Monthly Income: ₹${userContext.monthlyIncome}
- Risk Tolerance: ${userContext.riskTolerance}

Task: Explain this impact in 2-3 sentences using everyday language. Be direct and actionable.

Guidelines:
1. Use the exact numbers provided
2. Don't recalculate anything
3. Focus on what matters most
4. Be supportive but honest
5. Keep under 100 words

Provide the explanation now:
`;
  }

  /**
   * Build recommendation explanation prompt
   */
  buildRecommendationPrompt(recommendation, userContext) {
    return `
You are explaining a financial recommendation to a user.

Recommendation Data:
- Title: ${recommendation.title}
- Message: ${recommendation.message}
- Priority: ${recommendation.priority}
- Actions: ${recommendation.actions.join(', ')}
- Expected Improvement: ₹${recommendation.impact.balanceImprovement}
- Confidence: ${(recommendation.confidence * 100).toFixed(0)}%

User Context:
- Monthly Income: ₹${userContext.monthlyIncome}
- Current Risk Level: ${userContext.riskLevel}

Task: Explain WHY this recommendation makes sense in 2-3 sentences.

Guidelines:
1. Focus on the reasoning, not just the action
2. Use simple language
3. Be encouraging
4. Keep under 80 words

Explain now:
`;
  }

  /**
   * Build question answering prompt
   */
  buildQuestionPrompt(question, financialContext) {
    return `
You are a helpful financial copilot. Answer the user's question using ONLY the data provided.

User Question: "${question}"

Financial Context (DO NOT RECALCULATE):
- Current Balance: ₹${financialContext.currentBalance}
- Monthly Income: ₹${financialContext.monthlyIncome}
- Total Expenses This Month: ₹${financialContext.totalExpenses}
- Predicted End-of-Month Balance: ₹${financialContext.predictedEndBalance}
- Risk Level: ${financialContext.riskLevel}
- Days Remaining: ${financialContext.daysRemaining}
- Savings Goals: ${financialContext.savingsGoals.map(g => `${g.name} (₹${g.currentAmount}/₹${g.targetAmount})`).join(', ')}

Guidelines:
1. Answer directly using the data above
2. Don't make up numbers or calculations
3. If data is missing, say "I don't have that information"
4. Be conversational and helpful
5. Keep under 150 words
6. Use emojis sparingly (1-2 max)

Answer the question now:
`;
  }

  /**
   * Call Gemini API
   */
  async callGemini(prompt) {
    if (!this.apiKey) {
      return 'AI explanation unavailable: No API key configured';
    }

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      });

      if (!response.ok) {
        console.error('Gemini API error:', response.status);
        return 'Unable to generate explanation at this time.';
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated.';
    } catch (error) {
      console.error('Error calling Gemini:', error);
      return 'Unable to generate explanation at this time.';
    }
  }

  /**
   * Generate structured context for AI from user data
   */
  buildFinancialContext(user, expenses, incomes, goals, forecast) {
    return {
      currentBalance: forecast.currentBalance,
      monthlyIncome: user.monthlyIncome,
      totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      predictedEndBalance: forecast.predictedEndBalance,
      riskLevel: forecast.riskLevel || 'unknown',
      daysRemaining: forecast.breakdown?.daysRemaining || 0,
      savingsGoals: goals.map(g => ({
        name: g.name,
        currentAmount: g.currentAmount,
        targetAmount: g.targetAmount,
        progress: ((g.currentAmount / g.targetAmount) * 100).toFixed(0),
      })),
    };
  }

  /**
   * Explain "Can I afford this?" question
   */
  async explainAffordability(amount, financialContext, validationResult) {
    const prompt = `
User asks: "Can I afford to spend ₹${amount}?"

Financial Facts (from backend):
- Current Balance: ₹${financialContext.currentBalance}
- Predicted End Balance: ₹${financialContext.predictedEndBalance}
- After This Purchase: ₹${financialContext.predictedEndBalance - amount}
- Minimum Safety Threshold: ₹${financialContext.minimumThreshold}
- Validation: ${validationResult.isValid ? 'Safe' : 'Not Safe'}
${validationResult.violations.length > 0 ? '- Violations: ' + validationResult.violations.map(v => v.message).join(', ') : ''}

Answer in 2-3 sentences: Can they afford it? Why or why not?

Be direct, supportive, and use the numbers above. Keep under 100 words.
`;

    return await this.callGemini(prompt);
  }
}
