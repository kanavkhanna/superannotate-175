"use client"

import { useMemo } from "react"
import { useTheme } from "next-themes"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useExpenses } from "@/hooks/use-expenses"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ExpenseChart() {
  const { expenses, error } = useExpenses()
  const { theme } = useTheme()

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {}

    expenses.forEach((expense) => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0
      }
      totals[expense.category] += expense.amount
    })

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value: Number.parseFloat(value.toFixed(2)),
    }))
  }, [expenses])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Add expenses to see your spending breakdown</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data to display</p>
        </CardContent>
      </Card>
    )
  }

  const colors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f97316", // orange
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f43f5e", // rose
    "#a3e635", // lime
    "#64748b", // slate
  ]

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md border border-border">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="font-bold">${payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-lg sm:text-xl">Spending by Category</CardTitle>
        <CardDescription>Your expense breakdown by category</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryTotals}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: categoryTotals.length > 4 ? 60 : 30,
              }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: theme === "dark" ? "#e2e8f0" : "#64748b", fontSize: "0.75rem" }}
                tickLine={{ stroke: theme === "dark" ? "#475569" : "#cbd5e1" }}
                axisLine={{ stroke: theme === "dark" ? "#475569" : "#cbd5e1" }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis
                tick={{ fill: theme === "dark" ? "#e2e8f0" : "#64748b", fontSize: "0.75rem" }}
                tickLine={{ stroke: theme === "dark" ? "#475569" : "#cbd5e1" }}
                axisLine={{ stroke: theme === "dark" ? "#475569" : "#cbd5e1" }}
                tickFormatter={(value) => `$${value}`}
                width={45}
              />
              <Tooltip content={customTooltip} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {categoryTotals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

