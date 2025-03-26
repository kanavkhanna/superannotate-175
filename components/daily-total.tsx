"use client"

import { useMemo } from "react"
import { format, isToday, isYesterday, isSameWeek, isSameMonth } from "date-fns"
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useExpenses } from "@/hooks/use-expenses"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DailyTotal() {
  const { expenses, error } = useExpenses()

  const { todayTotal, yesterdayTotal, weekTotal, monthTotal } = useMemo(() => {
    const today = new Date()

    try {
      const todayExpenses = expenses.filter((expense) => isToday(new Date(expense.date)))

      const yesterdayExpenses = expenses.filter((expense) => isYesterday(new Date(expense.date)))

      const weekExpenses = expenses.filter((expense) => isSameWeek(new Date(expense.date), today, { weekStartsOn: 1 }))

      const monthExpenses = expenses.filter((expense) => isSameMonth(new Date(expense.date), today))

      return {
        todayTotal: todayExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        yesterdayTotal: yesterdayExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        weekTotal: weekExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        monthTotal: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      }
    } catch (err) {
      console.error("Error calculating totals:", err)
      return {
        todayTotal: 0,
        yesterdayTotal: 0,
        weekTotal: 0,
        monthTotal: 0,
      }
    }
  }, [expenses])

  const percentChange = useMemo(() => {
    if (yesterdayTotal === 0) return 0
    return ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
  }, [todayTotal, yesterdayTotal])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-sm font-medium">Today's Spending</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold">${todayTotal.toFixed(2)}</div>
          {yesterdayTotal > 0 && (
            <div className="flex items-center mt-1">
              {percentChange > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-destructive mr-1" />
                  <p className="text-xs text-destructive">{Math.abs(percentChange).toFixed(0)}% from yesterday</p>
                </>
              ) : percentChange < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-primary mr-1" />
                  <p className="text-xs text-primary">{Math.abs(percentChange).toFixed(0)}% from yesterday</p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Same as yesterday</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold">${weekTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">{format(new Date(), "'Week of' MMM d")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold">${monthTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">{format(new Date(), "MMMM yyyy")}</p>
        </CardContent>
      </Card>
    </div>
  )
}

