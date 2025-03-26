"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { format } from "date-fns"
import { Toaster } from "sonner"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useExpenses } from "@/hooks/use-expenses"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive")
    .min(0.01, "Amount must be at least 0.01"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  date: z.date({
    required_error: "Please select a date",
  }),
})

const categories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Healthcare",
  "Education",
  "Other",
]

export default function ExpenseForm() {
  const { addExpense, deleteExpense, restoreExpense, error: contextError } = useExpenses()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [datePopoverOpen, setDatePopoverOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      description: "",
      category: "",
      date: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)
    setFormError(null)

    try {
      const newExpense = {
        id: Date.now().toString(),
        amount: values.amount,
        description: values.description,
        category: values.category,
        date: values.date,
      }

      addExpense(newExpense)

      toast.success("Expense added successfully", {
        description: `$${values.amount.toFixed(2)} for ${values.description}`,
        action: {
          label: "Undo",
          onClick: () => {
            deleteExpense(newExpense.id)
            toast.info("Expense removed")
          },
        },
      })

      form.reset({
        amount: undefined,
        description: "",
        category: "",
        date: new Date(),
      })
    } catch (err) {
      console.error("Error submitting form:", err)
      setFormError("Failed to add expense. Please try again.")
      toast.error("Failed to add expense")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Add New Expense</h2>

      {(formError || contextError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{formError || contextError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? undefined : Number.parseFloat(value))
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Lunch, groceries, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setDatePopoverOpen(false)
                          }}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Adding...</span>
              </div>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </>
            )}
          </Button>
        </form>
      </Form>
      <Toaster position="bottom-right" />
    </div>
  )
}

