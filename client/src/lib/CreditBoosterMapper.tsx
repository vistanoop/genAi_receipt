// src/lib/creditBoosterMapper.ts

export const CREDIT_ACTION_MAP: Record<
    string,
    {
        title: string
        description: string
    }
> = {
    repayment_history: {
        title: "Improve repayment record",
        description: "Repay existing loans on time for the next cycle."
    },
    irrigation: {
        title: "Ensure assured irrigation",
        description: "Use borewell, drip, or canal irrigation if possible."
    },
    loan_purpose: {
        title: "Use loan only for farming",
        description: "Spend the loan on seeds, fertilizer, or crop inputs."
    },
    soil_quality: {
        title: "Improve soil health",
        description: "Use soil testing and organic inputs."
    },
    market_volatility: {
        title: "Reduce price uncertainty",
        description: "Use MSP, cooperatives, or forward contracts."
    },
    crop_season_risk: {
        title: "Choose season-appropriate crop",
        description: "Grow crops suitable for the current season."
    }
}

export function mapBoosterTip(tip: any) {
    const meta = CREDIT_ACTION_MAP[tip.factor]

    const formatPercent = (val: number) => (val * 100).toFixed(1) + "%"

    const common = {
        improvement: tip.risk_reduction,
        currentRisk: formatPercent(tip.current_risk),
        improvedRisk: formatPercent(tip.improved_risk)
    }

    if (!meta) {
        return {
            title: tip.factor.replace(/_/g, " "),
            description: "This factor affects your loan approval.",
            ...common
        }
    }

    return {
        ...meta,
        ...common
    }
}
