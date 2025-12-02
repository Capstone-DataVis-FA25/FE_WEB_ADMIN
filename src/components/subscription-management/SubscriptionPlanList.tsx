"use client"

import type React from "react"
import { useEffect } from "react"
import type { SubscriptionPlan } from "../../types"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { useSubscriptionPlans } from "../../hooks"
import { PlanCard } from "."
import { CreditCard, RefreshCw } from "lucide-react"

interface SubscriptionPlanListProps {
  onEdit: (plan: SubscriptionPlan) => void
  onDelete: (plan: SubscriptionPlan) => void
}

export const SubscriptionPlanList: React.FC<SubscriptionPlanListProps> = ({ onEdit, onDelete }) => {
  const { data: plans, isLoading, error, refetch } = useSubscriptionPlans()
  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching plans",
        description: error.message || "Failed to fetch subscription plans",
        variant: "destructive",
      })
    }
  }, [error, toast])

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-gradient-to-br from-destructive/5 to-destructive/10 p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h3 className="text-xl font-bold text-destructive">Failed to Load Plans</h3>
          <p className="text-sm text-muted-foreground">
            {error.message || "An error occurred while fetching subscription plans"}
          </p>
          <Button onClick={() => refetch()} className="rounded-full font-semibold shadow-md">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {plans && plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-border/50 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm shadow-lg">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
            <CreditCard className="w-16 h-16 text-primary" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            No Subscription Plans
          </h3>
          <p className="text-base text-muted-foreground max-w-md text-center leading-relaxed">
            Get started by creating your first subscription plan to offer to your users.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plans?.map((plan: SubscriptionPlan) => (
            <PlanCard key={plan.id} plan={plan} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
