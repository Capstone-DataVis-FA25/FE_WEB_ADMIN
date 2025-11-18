import React from "react";
import type { SubscriptionPlan } from "../../types";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { useSubscriptionPlans } from "../../hooks";
import { PlanCard } from ".";
import { Database } from "lucide-react";

interface SubscriptionPlanListProps {
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlanList: React.FC<SubscriptionPlanListProps> = ({
  onEdit,
  onDelete,
}) => {
  const { data: plans, isLoading, error, refetch } = useSubscriptionPlans();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const { toast } = useToast();

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching plans",
        description: error.message || "Failed to fetch subscription plans",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (error) {
    return (
      <div className="mb-6">
        <div className="mt-4 flex justify-center">
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {plans && plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card/80 rounded-2xl card-shadow-lg">
          <Database className="w-14 h-14 mb-4 text-accent" />
          <h3 className="mt-2 text-2xl font-bold text-primary mb-1">
            No subscription plans
          </h3>
          <p className="text-base text-muted-foreground max-w-xs text-center mb-2">
            Get started by creating a new subscription plan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans?.map((plan: SubscriptionPlan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
