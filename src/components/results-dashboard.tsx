"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Settings } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ResultsDashboardProps {
  data: any
  onBack: () => void
  onSimulate: () => void
}

export default function ResultsDashboard({ data, onBack, onSimulate }: ResultsDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", variant: "default" as const, color: "bg-green-100 text-green-800" }
    if (score >= 60) return { label: "Good", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" }
    return { label: "Needs Improvement", variant: "destructive" as const, color: "bg-red-100 text-red-800" }
  }

  // Prepare chart data
  const assetAllocationData = data.investments.map((inv: any, index: number) => ({
    name: inv.type.split(" ")[0],
    value: inv.amount,
    color: `hsl(${index * 45}, 70%, 50%)`,
  }))

  const performanceData = data.investments.map((inv: any) => ({
    name: inv.type.split(" ")[0],
    return: inv.returnRate,
    amount: inv.amount,
  }))

  const breakdownData = [
    { name: "Profitability", score: data.breakdown.profitability },
    { name: "Diversification", score: data.breakdown.diversification },
    { name: "Consistency", score: data.breakdown.consistency },
    { name: "Risk Alignment", score: data.breakdown.riskAlignment },
    { name: "Age Adjusted", score: data.breakdown.ageAdjusted },
  ]

  const scoreBadge = getScoreBadge(data.totalScore)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Form
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Analysis Results</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Comprehensive analysis of your investment portfolio</p>
          </div>
          <Button onClick={onSimulate} variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Try Simulator
          </Button>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Portfolio Score</CardTitle>
            <CardDescription>Overall performance rating based on multiple factors</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(data.totalScore)}`}>{data.totalScore}/100</div>
            <Badge className={scoreBadge.color}>{scoreBadge.label}</Badge>
            <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold">Total Investment</div>
                <div className="text-2xl font-bold text-blue-600">₹{data.totalInvestment.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-semibold">Average Return</div>
                <div className="text-2xl font-bold text-green-600">{data.avgReturn}%</div>
              </div>
              <div>
                <div className="font-semibold">Risk Level</div>
                <div className="text-2xl font-bold text-purple-600 capitalize">{data.riskAppetite}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>Individual component analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {breakdownData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className={`font-bold ${getScoreColor(item.score)}`}>{item.score}/100</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Asset Allocation Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>Distribution of your investments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assetAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, "Amount"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Investment Performance</CardTitle>
            <CardDescription>Return rates across your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    name === "return" ? `${value}%` : `₹${value.toLocaleString()}`,
                    name === "return" ? "Return Rate" : "Investment Amount",
                  ]}
                />
                <Bar dataKey="return" fill="#8884d8" name="return" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>Based on your portfolio analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.suggestions.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  {data.totalScore >= 70 ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
