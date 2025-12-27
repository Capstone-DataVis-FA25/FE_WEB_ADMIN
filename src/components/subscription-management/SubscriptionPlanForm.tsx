"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto, SubscriptionPlan } from "../../types"
import { LabeledInput } from "@/components/ui/labeled-input"
import { LabeledTextarea } from "@/components/ui/labeled-textarea"
import { LabeledSwitch } from "@/components/ui/labeled-switch"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/components/ui/toast"
import { validateSubscriptionPlanForm } from "../../utils/form-validation"

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan
  onSubmit: (planData: CreateSubscriptionPlanDto | UpdateSubscriptionPlanDto) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export const SubscriptionPlanForm: React.FC<SubscriptionPlanFormProps> = ({
  plan,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [name, setName] = useState(plan?.name || "")
  const [description, setDescription] = useState(plan?.description || "")
  const [price, setPrice] = useState(plan?.price.toString() || "")
  const [currency, setCurrency] = useState(plan?.currency || "VND")
  const [interval, setInterval] = useState(plan?.interval || "month")
  const [features, setFeatures] = useState(plan?.features?.join("\n") || "")
  const [maxDatasets, setMaxDatasets] = useState(plan?.limits?.maxDatasets?.toString() || "")
  const [maxCharts, setMaxCharts] = useState(plan?.limits?.maxCharts?.toString() || "")
  const [maxFileSize, setMaxFileSize] = useState(plan?.limits?.maxFileSize?.toString() || "")
  const [isActive, setIsActive] = useState(plan?.isActive ?? true)

  const [featureError, setFeatureError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (plan) {
      setName(plan.name)
      setDescription(plan.description || "")
      setPrice(plan.price.toString())
      setCurrency(plan.currency)
      setInterval(plan.interval)
      setFeatures(plan.features?.join("\n") || "")
      setMaxDatasets(plan.limits?.maxDatasets?.toString() || "")
      setMaxCharts(plan.limits?.maxCharts?.toString() || "")
      setMaxFileSize(plan.limits?.maxFileSize?.toString() || "")
      setIsActive(plan.isActive)
    }
  }, [plan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSubscriptionPlanForm({ name, price, maxDatasets, maxCharts, maxFileSize }, toast)) {
      return
    }

    // clear any previous feature error
    setFeatureError(null)

    try {
      const planData: CreateSubscriptionPlanDto | UpdateSubscriptionPlanDto = {
        name,
        description: description || undefined,
        price: Number.parseFloat(price),
        currency: currency || undefined,
        interval: interval || undefined,
        features: features
          ? features
              .split("\n")
              .map((f) => f.trim())
              .filter((f) => f)
          : undefined,
        limits: {
          maxDatasets: maxDatasets ? Number.parseInt(maxDatasets) : undefined,
          maxCharts: maxCharts ? Number.parseInt(maxCharts) : undefined,
          maxFileSize: maxFileSize ? Number.parseInt(maxFileSize) : undefined,
        },
        isActive: isActive,
      }

      await onSubmit(planData)
    } catch (err) {
      toast({
        title: "Save failed",
        description: "Failed to save subscription plan. Please try again.",
        variant: "destructive",
      })
      console.error("Error saving plan:", err)
    }
  }

  const handleFeatureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeatures(e.target.value)
    setFeatureError(null)
  }

  return (
    <div className="rounded-xl border border-border/50 shadow-lg bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm max-w-3xl mx-auto">
      <div className="p-8">
        <div className="mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            {plan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
          </h3>
          <p className="text-muted-foreground">
            {plan ? "Update the details of your subscription plan" : "Configure a new subscription plan for your users"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="pb-4 border-b border-border/50">
              <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">
                General Information
              </h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <LabeledInput label="Plan Name" value={name} onChange={(e) => setName(e.target.value)} required />
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
                {/* <LabeledInput
                  label="Interval"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                /> */}
              </div>
            </div>

            <div className="pb-4 border-b border-border/50">
              <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">
                Description & Features
              </h4>
              <div className="space-y-6">
                <LabeledTextarea
                  label="Description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <LabeledTextarea
                  label="Features (one per line)"
                  rows={5}
                  value={features}
                  onChange={handleFeatureChange}
                  error={featureError || undefined}
                />
              </div>
            </div>

            <div className="pb-4 border-b border-border/50">
              <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">Usage Limits</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">Status</h4>
              <LabeledSwitch checked={isActive} onCheckedChange={setIsActive} label="Active" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border/50">
            <LoadingButton
              type="button"
              variant="outline"
              className="rounded-full font-semibold px-8 py-2.5 shadow-md hover:bg-muted"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              className="rounded-full font-semibold px-8 py-2.5 shadow-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {plan ? "Update Plan" : "Create Plan"}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}
