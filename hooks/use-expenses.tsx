"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Mock data for initial expenses
const mockExpenses = [
  {
    id: "1",
    amount: 45.99,
    description: "Grocery shopping",
    category: "Food",
    date: new Date(2024, 3, 25), // Today
  },
  {
    id: "2",
    amount: 10.5,
    description: "Movie ticket",
    category: "Entertainment",
    date: new Date(2024, 3, 24), // Yesterday
  },
  {
    id: "3",
    amount: 28.75,
    description: "Gas",
    category: "Transportation",
    date: new Date(2024, 3, 23),
  },
  {
    id: "4",
    amount: 120.0,
    description: "Electricity bill",
    category: "Utilities",
    date: new Date(2024, 3, 22),
  },
  {
    id: "5",
    amount: 65.3,
    description: "New t-shirt",
    category: "Shopping",
    date: new Date(2024, 3, 21),
  },
]

export type Expense = {
  id: string
  amount: number
  description: string
  category: string
  date: Date
}

type ExpensesContextType = {
  expenses: Expense[]
  addExpense: (expense: Expense) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  restoreExpense: (expense: Expense) => void
  error: string | null
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined)

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [error, setError] = useState<string | null>(null)

  // Load expenses from localStorage on initial render or use mock data
  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem("expenses")

      if (savedExpenses) {
        try {
          const parsedExpenses = JSON.parse(savedExpenses)
          // Convert string dates back to Date objects
          const expensesWithDates = parsedExpenses.map((expense: any) => ({
            ...expense,
            date: new Date(expense.date),
          }))
          setExpenses(expensesWithDates)
        } catch (err) {
          console.error("Failed to parse expenses from localStorage:", err)
          setError("Failed to load your existing expenses. Using sample data instead.")
          setExpenses(mockExpenses)
        }
      } else {
        // If no saved expenses, use mock data
        console.log("No saved expenses found, using mock data")
        setExpenses(mockExpenses)
      }
    } catch (err) {
      console.error("Error accessing localStorage:", err)
      setError("Failed to access storage. Using sample data instead.")
      setExpenses(mockExpenses)
    }
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("expenses", JSON.stringify(expenses))
    } catch (err) {
      console.error("Failed to save expenses to localStorage:", err)
      setError("Failed to save your expenses to storage.")
    }
  }, [expenses])

  const addExpense = (expense: Expense) => {
    try {
      // Ensure the date is a Date object
      const newExpense = {
        ...expense,
        date: expense.date instanceof Date ? expense.date : new Date(expense.date),
      }
      setExpenses((prev) => [...prev, newExpense])
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error("Failed to add expense:", err)
      setError("Failed to add your expense. Please try again.")
    }
  }

  const updateExpense = (updatedExpense: Expense) => {
    try {
      // Ensure the date is a Date object
      const expenseWithDateObj = {
        ...updatedExpense,
        date: updatedExpense.date instanceof Date ? updatedExpense.date : new Date(updatedExpense.date),
      }

      setExpenses((prev) =>
        prev.map((expense) => (expense.id === expenseWithDateObj.id ? expenseWithDateObj : expense)),
      )
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error("Failed to update expense:", err)
      setError("Failed to update your expense. Please try again.")
    }
  }

  const deleteExpense = (id: string) => {
    try {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error("Failed to delete expense:", err)
      setError("Failed to delete your expense. Please try again.")
    }
  }

  // Add a restore function to add back a deleted expense
  const restoreExpense = (expense: Expense) => {
    try {
      // Ensure the date is a Date object
      const expenseToRestore = {
        ...expense,
        date: expense.date instanceof Date ? expense.date : new Date(expense.date),
      }

      setExpenses((prev) => [...prev, expenseToRestore])
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error("Failed to restore expense:", err)
      setError("Failed to restore your expense. Please try again.")
    }
  }

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        restoreExpense,
        error,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpensesContext)
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpensesProvider")
  }
  return context
}

