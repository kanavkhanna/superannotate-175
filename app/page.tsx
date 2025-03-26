import { Suspense } from "react"
import ExpenseForm from "@/components/expense-form"
import ExpenseList from "@/components/expense-list"
import ExpenseChart from "@/components/expense-chart"
import { DashboardHeader } from "@/components/dashboard-header"
import { DailyTotal } from "@/components/daily-total"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-4 sm:py-8">
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <ExpenseForm />

          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Daily Overview</h2>
            <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <DailyTotal />
            </Suspense>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Spending Overview</h2>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <ExpenseChart />
            </Suspense>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Recent Transactions</h2>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <ExpenseList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

