

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, PieChart, TrendingUp, Shield } from "lucide-react"
import InvestmentForm from "@/components/investment-form"
import ResultsDashboard from "@/components/results-dashboard"
import PortfolioSimulator from "@/components/portfolio-simulator"

export default function SmartPortfolioAnalyzer() {
  const [currentStep, setCurrentStep] = useState<"landing" | "form" | "results" | "simulator">("landing")
  const [portfolioData, setPortfolioData] = useState(null)

  const handleFormSubmit = (data: any) => {
    // Simulate backend analysis
    const analysisResult = analyzePortfolio(data)
    setPortfolioData(analysisResult)
    setCurrentStep("results")
  }

  const analyzePortfolio = (data: any) => {
    // Mock analysis logic - in real app, this would be backend API call
    const totalInvestment = data.investments.reduce((sum: number, inv: any) => sum + inv.amount, 0)
    const avgReturn =
      data.investments.reduce((sum: number, inv: any) => sum + inv.returnRate, 0) / data.investments.length

    // Calculate scores (0-100)
    const profitabilityScore = Math.min(100, Math.max(0, (avgReturn - 5) * 10))
    const diversificationScore = Math.min(100, data.investments.length * 15)
    
    const calculateConsistencyScore = (investments: any[]) => {
    const n = investments.length
    if (n === 0) return 0

    const meanReturn =
    investments.reduce((sum: number, inv: any) => sum + inv.returnRate, 0) / n

    const variance =
    investments.reduce(
    (sum: number, inv: any) =>
    sum + Math.pow(inv.returnRate - meanReturn, 2),
    0
    ) / n

    const stdDev = Math.sqrt(variance)

    // Invert stdDev to get a consistency score (lower stdDev = higher score)
    const score = Math.max(0, Math.min(100, 100 - stdDev * 20))
    return score
    }
    const consistencyScore = calculateConsistencyScore(data.investments)
    const riskAlignmentScore = calculateRiskAlignment(data.riskAppetite, data.investments)
    const ageAdjustedScore = calculateAgeAdjustment(data.age, avgReturn)

    const totalScore = Math.round(
      (profitabilityScore + diversificationScore + consistencyScore + riskAlignmentScore + ageAdjustedScore) / 5,
    )

    return {
      ...data,
      totalScore,
      breakdown: {
        profitability: Math.round(profitabilityScore),
        diversification: Math.round(diversificationScore),
        consistency: Math.round(consistencyScore),
        riskAlignment: Math.round(riskAlignmentScore),
        ageAdjusted: Math.round(ageAdjustedScore),
      },
      totalInvestment,
      avgReturn: Math.round(avgReturn * 100) / 100,
      suggestions: generateSuggestions(totalScore, data),
    }
  }

  const calculateRiskAlignment = (riskAppetite: string, investments: any[]) => {
    const riskMap = { low: 1, medium: 2, high: 3 }
    const userRisk = riskMap[riskAppetite as keyof typeof riskMap]
    const avgInvestmentRisk =
      investments.reduce((sum, inv) => sum + riskMap[inv.riskLevel as keyof typeof riskMap], 0) / investments.length
    return Math.max(0, 100 - Math.abs(userRisk - avgInvestmentRisk) * 30)
  }

  const calculateAgeAdjustment = (age: number, avgReturn: number) => {
    if (age < 30) return Math.min(100, avgReturn * 8)
    if (age < 50) return Math.min(100, avgReturn * 6)
    return Math.min(100, avgReturn * 4)
  }

  const generateSuggestions = (score: number, data: any) => {
    const suggestions = []
    if (score < 60) {
      suggestions.push("Consider diversifying your portfolio across different asset classes")
      suggestions.push("Review your investment strategy to align with your risk appetite")
    }
    if (data.investments.length < 5) {
      suggestions.push("Add more investment types to improve diversification")
    }
    if (data.age > 50 && data.riskAppetite === "high") {
      suggestions.push("Consider reducing risk exposure as you approach retirement")
    }
    return suggestions
  }

  if (currentStep === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Smart Portfolio <span className="text-blue-600">Analyzer</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Get comprehensive insights into your investment portfolio with AI-powered analysis. Discover your
              portfolio score, risk alignment, and personalized recommendations.
            </p>
            <Button size="lg" onClick={() => setCurrentStep("form")} className="text-lg px-8 py-6">
              Start Your Analysis <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Portfolio Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get a comprehensive score based on profitability, diversification, and risk alignment
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <PieChart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Visual Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Interactive charts showing asset allocation and performance breakdown</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Detailed analysis of returns, consistency, and age-adjusted performance
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Evaluate if your portfolio matches your risk appetite and investment goals
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Input Your Data</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter your age, risk appetite, and investment details
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our algorithm analyzes your portfolio across multiple dimensions
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Get Insights</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive your score, recommendations, and actionable insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "form") {
    return <InvestmentForm onSubmit={handleFormSubmit} onBack={() => setCurrentStep("landing")} />
  }

  if (currentStep === "results") {
    return (
      <ResultsDashboard
        data={portfolioData}
        onBack={() => setCurrentStep("form")}
        onSimulate={() => setCurrentStep("simulator")}
      />
    )
  }

  if (currentStep === "simulator") {
    return <PortfolioSimulator initialData={portfolioData} onBack={() => setCurrentStep("results")} />
  }

  return null
}
