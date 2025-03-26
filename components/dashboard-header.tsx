import { CalendarIcon } from "lucide-react"

export function DashboardHeader() {
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Daily Expense Tracker</h1>
        <div className="flex items-center mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
          <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  )
}

