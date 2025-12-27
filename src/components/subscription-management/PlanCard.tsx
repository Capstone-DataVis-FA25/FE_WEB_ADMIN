"use client";

import type React from "react";
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
import { CheckCircle, Edit, Trash2 } from "lucide-react";
import {
  formatPrice,
  // formatInterval,
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
    <Card className="flex flex-col h-full rounded-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-1">
              {plan.name}
            </CardTitle>
            {plan.description && (
              <CardDescription className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {plan.description}
              </CardDescription>
            )}
          </div>
          <div
            className={`px-2 py-1 rounded-full text-[10px] font-bold shadow-md transition-all ${
              plan.isActive
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
            }`}
          >
            {plan.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-3 px-4 space-y-4">
        <div className="pb-3 border-b border-border/50">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatPrice(plan.price, plan.currency)}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {/* {formatInterval(plan.interval)} */}
            </span>
          </div>
        </div>

        {plan.features && plan.features.length > 0 && (
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
              Features
            </h4>
            <ul className="space-y-1.5">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs">
                  <div className="mt-0.5 p-0.5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                    <CheckCircle className="w-3 h-3 text-primary" />
                  </div>
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.limits && (
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
              Limits
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {plan.limits.maxDatasets !== undefined && (
                <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200/30">
                  <span className="text-xs font-medium">Max Datasets</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {plan.limits.maxDatasets}
                  </span>
                </div>
              )}
              {plan.limits.maxCharts !== undefined && (
                <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border border-purple-200/30">
                  <span className="text-xs font-medium">Max Charts</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {plan.limits.maxCharts}
                  </span>
                </div>
              )}
              {plan.limits.maxFileSize !== undefined && (
                <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-200/30">
                  <span className="text-xs font-medium">Max File Size</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {plan.limits.maxFileSize}MB
                  </span>
                </div>
              )}
              {plan.limits.maxAiRequests !== undefined && (
                <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border border-green-200/30">
                  <span className="text-xs font-medium">Max AI Requests</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {plan.limits.maxAiRequests}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-border/50 space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span className="font-medium">Created</span>
            <span>{formatDate(plan.createdAt)}</span>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span className="font-medium">Updated</span>
            <span>{formatDate(plan.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3 pb-4 px-4 border-t border-border/50">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 text-xs rounded-full font-semibold shadow-md transition-all hover:bg-primary/10 hover:border-primary/50 bg-transparent"
          onClick={() => onEdit(plan)}
        >
          <Edit className="w-3.5 h-3.5 mr-1.5" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1 h-8 text-xs rounded-full font-semibold shadow-md transition-all hover:bg-destructive/90"
          onClick={() => onDelete(plan)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
