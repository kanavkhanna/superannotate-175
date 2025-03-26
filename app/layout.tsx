import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ExpensesProvider } from "@/hooks/use-expenses"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Daily Expense Tracker",
  description: "Track and manage your daily expenses",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ExpensesProvider>{children}</ExpensesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'