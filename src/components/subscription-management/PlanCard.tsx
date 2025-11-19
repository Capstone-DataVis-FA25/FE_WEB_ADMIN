import React from "react";
import type { SubscriptionPlan } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import {
  formatPrice,
  formatInterval,
  formatDate,
} from "../../helpers/formatter";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="glass-card card-shadow-lg flex flex-col h-full rounded-2xl border border-border bg-card/80 dark:bg-card/70 transition-shadow hover:shadow-2xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
              {plan.name}
            </CardTitle>
            {plan.description && (
              <CardDescription className="mt-2 text-base text-muted-foreground">
                {plan.description}
              </CardDescription>
            )}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-colors ${
              plan.isActive
                ? "bg-green-200 dark:bg-green-700/40 text-green-800 dark:text-green-200"
                : "bg-gray-200 dark:bg-zinc-800/40 text-gray-700 dark:text-gray-200"
            }`}
          >
            {plan.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-0">
        <div className="text-4xl font-black leading-tight mb-2 text-primary">
          {formatPrice(plan.price, plan.currency)}
          <span className="ml-2 text-lg font-medium text-muted-foreground">
            {formatInterval(plan.interval)}
          </span>
        </div>

        {plan.features && plan.features.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-base">Features:</h4>
            <ul className="flex flex-col gap-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary/70 dark:text-primary/90" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {plan.limits && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-base">Limits:</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm">
              {plan.limits.maxDatasets !== undefined && (
                <div className="flex justify-between w-full">
                  <span>Datasets:</span>
                  <span className="font-bold">{plan.limits.maxDatasets}</span>
                </div>
              )}
              {plan.limits.maxCharts !== undefined && (
                <div className="flex justify-between w-full">
                  <span>Charts:</span>
                  <span className="font-bold">{plan.limits.maxCharts}</span>
                </div>
              )}
              {plan.limits.maxFileSize !== undefined && (
                <div className="flex justify-between w-full">
                  <span>File size:</span>
                  <span className="font-bold">{plan.limits.maxFileSize}MB</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-6 space-y-1">
          <div>Created: {formatDate(plan.createdAt)}</div>
          <div>Updated: {formatDate(plan.updatedAt)}</div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full px-4 py-2 font-semibold shadow-md transition-all hover:bg-primary/20 dark:hover:bg-primary/30"
          onClick={() => onEdit(plan)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="rounded-full px-4 py-2 font-semibold shadow-md transition-all hover:bg-destructive/80"
          onClick={() => onDelete(plan)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
