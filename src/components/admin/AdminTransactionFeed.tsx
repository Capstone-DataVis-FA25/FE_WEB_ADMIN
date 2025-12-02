
import type React from "react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  AlertCircle,
  Clock,
  ChevronDown,
  Info,
  CreditCard,
  CheckCircle2,
  XCircle,
  Hourglass,
  RefreshCcw,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { systemService } from "@/services/system"
import { cn } from "@/lib/utils"
import type { AdminTransactionPage, Transaction } from '@/types/system.types';

type IconType = React.ComponentType<{ className?: string }>

type IconSpec = {
  Icon: IconType
  colorClass: string
  bgClass: string
  label?: string
}

const statusToIcon: Record<string, IconSpec> = {
  completed: {
    Icon: CheckCircle2,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
    label: "COMPLETED",
  },
  pending: {
    Icon: Hourglass,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    label: "PENDING",
  },
  failed: {
    Icon: XCircle,
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-100 dark:bg-red-900/30",
    label: "FAILED",
  },
  refunded: {
    Icon: RefreshCcw,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    label: "REFUNDED",
  },
}

const getIconForStatus = (status?: string): IconSpec => {
  if (!status)
    return {
      Icon: CreditCard,
      colorClass: "text-slate-600 dark:text-slate-400",
      bgClass: "bg-slate-100 dark:bg-slate-800",
    }
  const key = status.toLowerCase()
  return (
    statusToIcon[key] ?? {
      Icon: CreditCard,
      colorClass: "text-slate-600 dark:text-slate-400",
      bgClass: "bg-slate-100 dark:bg-slate-800",
    }
  )
}

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className="grid grid-cols-[120px_1fr] gap-2 text-xs py-1 border-b border-slate-200 dark:border-slate-800 last:border-0">
    <span className="font-medium text-muted-foreground capitalize">{label.replace(/([A-Z])/g, " $1").trim()}</span>
    <span className="text-foreground font-mono break-all">
      {typeof value === "object" ? JSON.stringify(value) : String(value)}
    </span>
  </div>
)

function TransactionDetails({
  tx,
  isOpen,
  onToggle,
}: {
  tx: Transaction
  isOpen: boolean
  onToggle: () => void
}) {
  const dt = new Date(tx.createdAt)
  // Omit fields using destructuring
  const { id, createdAt, status, amount, currency, ...additionalDetails } = tx
  const hasDetails = Object.keys(additionalDetails).length > 0

  // Always use valid ISO currency code for toLocaleString
  let displayCurrency = (currency || 'VND').toUpperCase()
  if (displayCurrency === 'VNĐ' || displayCurrency === 'VND' || displayCurrency === 'VND.') {
    displayCurrency = 'VND'
  } else if (displayCurrency.length !== 3) {
    displayCurrency = 'VND'
  }

  return (
    <>
      <div className="p-3 flex gap-3 group" onClick={() => hasDetails && onToggle()}>
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-foreground leading-none mb-1.5">
                {amount.toLocaleString("vi-VN", { style: "currency", currency: displayCurrency })}
              </p>
              <div className="text-xs text-muted-foreground">
                <span className="font-mono">ID: {tx.id}</span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap font-mono bg-muted/50 px-1.5 py-0.5 rounded">
              {dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">{dt.toLocaleDateString()}</span>
            <span className="inline-flex items-center text-[10px] h-4 px-1.5 rounded border border-slate-200 dark:border-slate-700 bg-background/50">
              {tx.status}
            </span>
          </div>
        </div>

        {hasDetails && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200 mt-1",
              isOpen && "rotate-180",
            )}
          />
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0 pl-[52px]">
              <div className="bg-background/50 rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-xs">
                <div className="flex items-center gap-2 mb-2 font-medium text-muted-foreground">
                  <Info className="w-3 h-3" />
                  Transaction Details
                </div>
                <div className="space-y-1">
                  {Object.entries(additionalDetails).map(([key, value]) => (
                    <DetailRow key={key} label={key} value={value} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function AdminTransactionFeed() {
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const { data, isLoading, error } = useQuery<AdminTransactionPage>({
    queryKey: ["adminTransactions", page],
    queryFn: () => systemService.getAdminTransactions(page, 20),
  })

  const pageData = data && Array.isArray(data.data)
    ? data
    : { data: [], page: 1, totalPages: 1, total: 0, limit: 20 }

  // Handle both possible shapes: { data: Transaction[] } or Transaction[]
  let transactions: Transaction[] = []
  if (Array.isArray(data)) {
    transactions = data as Transaction[]
  } else if (data && Array.isArray((data as any).data)) {
    transactions = (data as any).data
  }

  // Debug: log actual transactions array
  if (typeof window !== 'undefined') {
    console.log('Transaction data:', data)
    console.log('Transactions array:', transactions)
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Transactions</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <Clock className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-card border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-8 h-8 text-destructive mb-2" />
          <p className="text-sm font-medium">Failed to load transactions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card border border-slate-200 dark:border-slate-800 shadow-sm grid grid-rows-[auto_1fr_auto] h-full min-h-[500px] relative">
      {/* Sticky header với nền đặc (không trong suốt) */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-card dark:bg-card sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Transactions</h2>
            <p className="text-xs text-muted-foreground">All payment transactions</p>
          </div>
        </div>
        <span className="inline-flex items-center bg-background/50 backdrop-blur text-[10px] h-5 px-2 rounded border border-slate-200 dark:border-slate-700">
          Page {pageData.page} / {pageData.totalPages}
        </span>
      </div>
      {/* Khu vực scroll riêng cho danh sách */}
      <div className="overflow-y-auto overscroll-contain px-0">
        <div className="p-4 space-y-2">
          <AnimatePresence initial={false}>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((tx: Transaction) => {
                const spec = getIconForStatus(tx.status)
                const isOpen = !!expanded[tx.id]
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "rounded-xl transition-all duration-200 border cursor-pointer",
                      isOpen
                        ? "bg-muted/50 border-slate-200 dark:border-slate-800 shadow-sm"
                        : "border-transparent hover:bg-muted/30 hover:border-slate-200/50 dark:hover:border-slate-800/50",
                    )}
                  >
                    <div className={cn("flex gap-3", isOpen ? "bg-muted/10" : "")}>
                      <div className="p-3">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105 shadow-sm",
                            spec.bgClass,
                            spec.colorClass,
                          )}
                        >
                          <spec.Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <TransactionDetails
                          tx={tx}
                          isOpen={isOpen}
                          onToggle={() => setExpanded((s) => ({ ...s, [tx.id]: !isOpen }))}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <CreditCard className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground">No transactions found</p>
                <p className="text-xs text-muted-foreground mt-1">Payment transactions will appear here</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination cố định phía dưới với nền đặc */}
      <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-card dark:bg-card sticky bottom-0 z-20 shadow-sm">
        <span className="text-xs text-muted-foreground">Total: {pageData.total} transactions</span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-background hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-background hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page >= (pageData.totalPages || 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
