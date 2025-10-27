import React, { useState, useEffect } from "react";
import type {
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
  SubscriptionPlan,
} from "../../types";
import { LabeledInput } from "@/components/ui/labeled-input";
import { LabeledTextarea } from "@/components/ui/labeled-textarea";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { LoadingButton } from "@/components/ui/loading-button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan;
  onSubmit: (
    planData: CreateSubscriptionPlanDto | UpdateSubscriptionPlanDto
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const SubscriptionPlanForm: React.FC<SubscriptionPlanFormProps> = ({
  plan,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [name, setName] = useState(plan?.name || "");
  const [description, setDescription] = useState(plan?.description || "");
  const [price, setPrice] = useState(plan?.price.toString() || "");
  const [currency, setCurrency] = useState(plan?.currency || "USD");
  const [interval, setInterval] = useState(plan?.interval || "month");
  const [features, setFeatures] = useState(plan?.features?.join("\n") || "");
  const [maxDatasets, setMaxDatasets] = useState(
    plan?.limits?.maxDatasets?.toString() || ""
  );
  const [maxCharts, setMaxCharts] = useState(
    plan?.limits?.maxCharts?.toString() || ""
  );
  const [maxFileSize, setMaxFileSize] = useState(
    plan?.limits?.maxFileSize?.toString() || ""
  );
  const [isActive, setIsActive] = useState(plan?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(plan?.sortOrder.toString() || "0");
  const [stripePriceId, setStripePriceId] = useState(plan?.stripePriceId || "");

  const [error, setError] = useState<string | null>(null);
  const [featureError, setFeatureError] = useState<string | null>(null);

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setDescription(plan.description || "");
      setPrice(plan.price.toString());
      setCurrency(plan.currency);
      setInterval(plan.interval);
      setFeatures(plan.features?.join("\n") || "");
      setMaxDatasets(plan.limits?.maxDatasets?.toString() || "");
      setMaxCharts(plan.limits?.maxCharts?.toString() || "");
      setMaxFileSize(plan.limits?.maxFileSize?.toString() || "");
      setIsActive(plan.isActive);
      setSortOrder(plan.sortOrder.toString());
      setStripePriceId(plan.stripePriceId || "");
    }
  }, [plan]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError("Plan name is required");
      return false;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setError("Valid price is required");
      return false;
    }

    if (
      maxDatasets &&
      (isNaN(parseInt(maxDatasets)) || parseInt(maxDatasets) <= 0)
    ) {
      setError("Max datasets must be a positive number");
      return false;
    }

    if (maxCharts && (isNaN(parseInt(maxCharts)) || parseInt(maxCharts) <= 0)) {
      setError("Max charts must be a positive number");
      return false;
    }

    if (
      maxFileSize &&
      (isNaN(parseInt(maxFileSize)) || parseInt(maxFileSize) <= 0)
    ) {
      setError("Max file size must be a positive number");
      return false;
    }

    if (sortOrder && (isNaN(parseInt(sortOrder)) || parseInt(sortOrder) < 0)) {
      setError("Sort order must be a non-negative number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError(null);

    try {
      const planData: CreateSubscriptionPlanDto | UpdateSubscriptionPlanDto = {
        name,
        description: description || undefined,
        price: parseFloat(price),
        currency: currency || undefined,
        interval: interval || undefined,
        features: features
          ? features
              .split("\n")
              .map((f) => f.trim())
              .filter((f) => f)
          : undefined,
        limits: {
          maxDatasets: maxDatasets ? parseInt(maxDatasets) : undefined,
          maxCharts: maxCharts ? parseInt(maxCharts) : undefined,
          maxFileSize: maxFileSize ? parseInt(maxFileSize) : undefined,
        },
        isActive: isActive,
        sortOrder: parseInt(sortOrder),
        stripePriceId: stripePriceId || undefined,
      };

      await onSubmit(planData);
    } catch (err) {
      setError("Failed to save subscription plan. Please try again.");
      console.error("Error saving plan:", err);
    }
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeatures(e.target.value);
    setFeatureError(null);
  };

  return (
    <div className="glass-card card-shadow-lg bg-card/80 dark:bg-card/70 rounded-2xl max-w-2xl mx-auto mt-6 mb-6">
      <div className="px-6 py-8">
        <h3 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          {plan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
        </h3>

        {error && (
          <div className="mt-4">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-8">
          {/* General Info */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
            <LabeledInput
              label="Plan Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <LabeledInput
              label="Price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <LabeledInput
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
            <LabeledInput
              label="Interval"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            />
          </div>
          {/* Description */}
          <div>
            <LabeledTextarea
              label="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* Features */}
          <div>
            <LabeledTextarea
              label="Features (one per line)"
              rows={4}
              value={features}
              onChange={handleFeatureChange}
              error={featureError || undefined}
            />
          </div>
          {/* Limits */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
            <LabeledInput
              label="Max Datasets"
              type="number"
              min="0"
              value={maxDatasets}
              onChange={(e) => setMaxDatasets(e.target.value)}
            />
            <LabeledInput
              label="Max Charts"
              type="number"
              min="0"
              value={maxCharts}
              onChange={(e) => setMaxCharts(e.target.value)}
            />
            <LabeledInput
              label="Max File Size (MB)"
              type="number"
              min="0"
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(e.target.value)}
            />
          </div>
          {/* Other Fields */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            <LabeledInput
              label="Sort Order"
              type="number"
              min="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            <LabeledInput
              label="Stripe Price ID (optional)"
              value={stripePriceId}
              onChange={(e) => setStripePriceId(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <LabeledSwitch
              checked={isActive}
              onCheckedChange={setIsActive}
              label="Active"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-2">
            <LoadingButton
              type="button"
              variant="secondary"
              className="rounded-full font-bold px-6 py-2"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              className="rounded-full font-bold px-6 py-2 bg-primary text-primary-foreground"
            >
              {plan ? "Update Plan" : "Create Plan"}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
