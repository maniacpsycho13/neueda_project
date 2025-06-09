"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ArrowLeft } from "lucide-react"

interface Investment {
  id: string
  type: string
  amount: number
  returnRate: number
  startDate: string
  riskLevel: string
}

interface FormData {
  age: number
  riskAppetite: string
  investments: Investment[]
}

interface InvestmentFormProps {
  onSubmit: (data: FormData) => void
  onBack: () => void
}

export default function InvestmentForm({ onSubmit, onBack }: InvestmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    age: 0,
    riskAppetite: "",
    investments: [
      {
        id: "1",
        type: "",
        amount: 0,
        returnRate: 0,
        startDate: "",
        riskLevel: "",
      },
    ],
  })

  const investmentTypes = [
    "SIP (Systematic Investment Plan)",
    "Mutual Fund",
    "Stocks",
    "Bonds",
    "Fixed Deposit",
    "Real Estate",
    "Gold/Commodities",
    "Cryptocurrency",
    "PPF",
    "ELSS",
  ]

  const addInvestment = () => {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      type: "",
      amount: 0,
      returnRate: 0,
      startDate: "",
      riskLevel: "",
    }
    setFormData((prev) => ({
      ...prev,
      investments: [...prev.investments, newInvestment],
    }))
  }

  const removeInvestment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      investments: prev.investments.filter((inv) => inv.id !== id),
    }))
  }

  const updateInvestment = (id: string, field: keyof Investment, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      investments: prev.investments.map((inv) => (inv.id === id ? { ...inv, [field]: value } : inv)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.age &&
      formData.riskAppetite &&
      formData.investments.every((inv) => inv.type && inv.amount && inv.returnRate && inv.startDate && inv.riskLevel)
    ) {
      onSubmit(formData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Analysis Form</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Please provide your investment details for comprehensive analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details to personalize your analysis</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: Number.parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Appetite</Label>
                <Select
                  value={formData.riskAppetite}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, riskAppetite: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your risk appetite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Conservative investor</SelectItem>
                    <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                    <SelectItem value="high">High - Aggressive investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Investment Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Investment Portfolio</CardTitle>
                <CardDescription>Add all your current investments for analysis</CardDescription>
              </div>
              <Button type="button" onClick={addInvestment} variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Investment
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.investments.map((investment, index) => (
                <div key={investment.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Investment #{index + 1}</h3>
                    {formData.investments.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInvestment(investment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Investment Type</Label>
                      <Select
                        value={investment.type}
                        onValueChange={(value) => updateInvestment(investment.id, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {investmentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Amount Invested (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={investment.amount || ""}
                        onChange={(e) =>
                          updateInvestment(investment.id, "amount", Number.parseInt(e.target.value) || 0)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Return Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={investment.returnRate || ""}
                        onChange={(e) =>
                          updateInvestment(investment.id, "returnRate", Number.parseFloat(e.target.value) || 0)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={investment.startDate}
                        onChange={(e) => updateInvestment(investment.id, "startDate", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Risk Level</Label>
                      <Select
                        value={investment.riskLevel}
                        onValueChange={(value) => updateInvestment(investment.id, "riskLevel", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg" className="px-12">
              Analyze My Portfolio
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
