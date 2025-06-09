"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface PortfolioSimulatorProps {
  initialData: any
  onBack: () => void
}

export default function PortfolioSimulator({ initialData, onBack }: PortfolioSimulatorProps) {
  const [simulationData, setSimulationData] = useState({
    newInvestmentAmount: 50000,
    newInvestmentType: "Mutual Fund",
    newReturnRate: 12,
    newRiskLevel: "medium",
    timeHorizon: 5,
  })

  const [simulatedResults, setSimulatedResults] = useState(null)

  const runSimulation = () => {
    // Mock simulation logic
    const currentTotal = initialData.totalInvestment
    const newTotal = currentTotal + simulationData.newInvestmentAmount
    const weightedReturn =
      (initialData.avgReturn * currentTotal + simulationData.newReturnRate * simulationData.newInvestmentAmount) /
      newTotal

    // Calculate new scores
    const newProfitabilityScore = Math.min(100, Math.max(0, (weightedReturn - 5) * 10))
    const newDiversificationScore = Math.min(100, (initialData.investments.length + 1) * 15)
    const newTotalScore = Math.round(
      (newProfitabilityScore +
        initialData.breakdown.diversification +
        initialData.breakdown.consistency +
        initialData.breakdown.riskAlignment +
        initialData.breakdown.ageAdjusted) /
        5,
    )

    // Generate projection data
    const projectionData = []
    let currentValue = newTotal
    for (let year = 1; year <= simulationData.timeHorizon; year++) {
      currentValue = currentValue * (1 + weightedReturn / 100)
      projectionData.push({
        year: `Year ${year}`,
        value: Math.round(currentValue),
        originalValue: Math.round(initialData.totalInvestment * Math.pow(1 + initialData.avgReturn / 100, year)),
      })
    }

    setSimulatedResults({
      newTotalScore,
      newTotalInvestment: newTotal,
      newAvgReturn: Math.round(weightedReturn * 100) / 100,
      projectionData,
      improvement: newTotalScore - initialData.totalScore,
    })
  }

  const comparisonData = simulatedResults
    ? [
        { name: "Current Portfolio", score: initialData.totalScore, investment: initialData.totalInvestment },
        {
          name: "Simulated Portfolio",
          score: simulatedResults.newTotalScore,
          investment: simulatedResults.newTotalInvestment,
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Simulator</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Experiment with different investment scenarios and see how they impact your portfolio
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Simulation Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Parameters</CardTitle>
              <CardDescription>Adjust the parameters to see different scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>New Investment Amount (₹)</Label>
                <Input
                  type="number"
                  value={simulationData.newInvestmentAmount}
                  onChange={(e) =>
                    setSimulationData((prev) => ({
                      ...prev,
                      newInvestmentAmount: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Investment Type</Label>
                <Select
                  value={simulationData.newInvestmentType}
                  onValueChange={(value) => setSimulationData((prev) => ({ ...prev, newInvestmentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                    <SelectItem value="Stocks">Stocks</SelectItem>
                    <SelectItem value="Bonds">Bonds</SelectItem>
                    <SelectItem value="SIP">SIP</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Expected Return Rate: {simulationData.newReturnRate}%</Label>
                <Slider
                  value={[simulationData.newReturnRate]}
                  onValueChange={(value) => setSimulationData((prev) => ({ ...prev, newReturnRate: value[0] }))}
                  max={25}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Risk Level</Label>
                <Select
                  value={simulationData.newRiskLevel}
                  onValueChange={(value) => setSimulationData((prev) => ({ ...prev, newRiskLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Horizon: {simulationData.timeHorizon} years</Label>
                <Slider
                  value={[simulationData.timeHorizon]}
                  onValueChange={(value) => setSimulationData((prev) => ({ ...prev, timeHorizon: value[0] }))}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button onClick={runSimulation} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Simulation
              </Button>
            </CardContent>
          </Card>

          {/* Simulation Results */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>Impact of your hypothetical changes</CardDescription>
            </CardHeader>
            <CardContent>
              {simulatedResults ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-300">New Score</div>
                      <div className="text-2xl font-bold text-blue-600">{simulatedResults.newTotalScore}/100</div>
                      <div
                        className={`text-sm ${simulatedResults.improvement >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {simulatedResults.improvement >= 0 ? "+" : ""}
                        {simulatedResults.improvement} points
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-300">New Total</div>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{simulatedResults.newTotalInvestment.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Avg Return: {simulatedResults.newAvgReturn}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Portfolio Comparison</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">Run a simulation to see the results</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Projection Chart */}
        {simulatedResults && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Growth Projection</CardTitle>
              <CardDescription>Comparison of portfolio growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={simulatedResults.projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, "Portfolio Value"]} />
                  <Line
                    type="monotone"
                    dataKey="originalValue"
                    stroke="#ff7300"
                    name="Current Portfolio"
                    strokeDasharray="5 5"
                  />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Simulated Portfolio" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
