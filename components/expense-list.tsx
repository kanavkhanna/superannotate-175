"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useExpenses } from "@/hooks/use-expenses"
import ExpenseEditDialog from "./expense-edit-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ExpenseList() {
  const { expenses, deleteExpense, restoreExpense, error } = useExpenses()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (expense: any) => {
    setSelectedExpense(expense)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedExpense) {
      setDeleting(true)
      try {
        const deletedExpense = { ...selectedExpense }
        deleteExpense(selectedExpense.id)

        toast.success("Expense deleted", {
          description: `${deletedExpense.description} has been removed`,
          action: {
            label: "Undo",
            onClick: () => {
              restoreExpense(deletedExpense)
              toast.info("Expense restored")
            },
          },
        })
      } catch (err) {
        console.error("Error deleting expense:", err)
        toast.error("Failed to delete expense")
      } finally {
        setDeleting(false)
        setDeleteDialogOpen(false)
      }
    }
  }

  const handleEdit = (expense: any) => {
    // Make sure we're working with a fresh copy of the expense
    const expenseCopy = JSON.parse(JSON.stringify(expense))
    setSelectedExpense(expenseCopy)
    setEditDialogOpen(true)
  }

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
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No expenses recorded yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Add your first expense using the form.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <ScrollArea className="h-[400px] sm:h-[500px] md:h-[600px] pr-4">
        <div className="space-y-4">
          {expenses.map((expense) => (
            <Card key={expense.id} className="group hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm sm:text-base">{expense.description}</CardTitle>
                  <span className="text-base sm:text-lg font-bold">${expense.amount.toFixed(2)}</span>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  {expense.category} • {format(new Date(expense.date), "MMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 pb-2 px-4 sm:px-6 flex flex-wrap gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-end space-x-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(expense)}
                    className="text-xs sm:text-sm h-8"
                  >
                    <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(expense)}
                    className="text-xs sm:text-sm h-8"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedExpense && (
        <ExpenseEditDialog expense={selectedExpense} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      )}
    </>
  )
}

