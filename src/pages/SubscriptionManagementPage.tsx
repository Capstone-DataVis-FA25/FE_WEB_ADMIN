import React, { useState } from "react";
import type {
  SubscriptionPlan,
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
} from "../types";
import { SubscriptionPlanList } from "../components/subscription-management/SubscriptionPlanList";
import { SubscriptionPlanForm } from "../components/subscription-management/SubscriptionPlanForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import {
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
} from "../hooks";
import ConfirmationModal from "@/components/common/ConfirmationModal";

export const SubscriptionManagementPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(
    null
  );

  // TanStack Query hooks
  const { mutate: createPlan, isPending: isCreating } =
    useCreateSubscriptionPlan();
  const { mutate: updatePlan, isPending: isUpdating } =
    useUpdateSubscriptionPlan();
  const { mutate: deletePlan, isPending: isDeleting } =
    useDeleteSubscriptionPlan();

  const isSubmitting = isCreating || isUpdating;

  const handleCreateNew = () => {
    setSelectedPlan(null);
    setCurrentView("form");
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setCurrentView("form");
  };

  const handleDelete = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (
    planData: CreateSubscriptionPlanDto | UpdateSubscriptionPlanDto
  ) => {
    try {
      // clear previous

      if (selectedPlan) {
        // Update existing plan
        updatePlan(
          {
            id: selectedPlan.id,
            planData: planData as UpdateSubscriptionPlanDto,
          },
          {
            onSuccess: () => {
              toast({
                title: "Subscription plan updated",
                description: "Subscription plan updated successfully!",
                variant: "success",
              });
              setCurrentView("list");
            },
            onError: (error: unknown) => {
              toast({
                title: "Update failed",
                description:
                  "Failed to update subscription plan. Please try again.",
                variant: "destructive",
              });
              console.error("Error updating plan:", error);
            },
          }
        );
      } else {
        // Create new plan
        createPlan(planData as CreateSubscriptionPlanDto, {
          onSuccess: () => {
            toast({
              title: "Subscription plan created",
              description: "Subscription plan created successfully!",
              variant: "success",
            });
            setCurrentView("list");
          },
          onError: (error: unknown) => {
            toast({
              title: "Create failed",
              description:
                "Failed to create subscription plan. Please try again.",
              variant: "destructive",
            });
            console.error("Error creating plan:", error);
          },
        });
      }
    } catch (err) {
      console.error("Error saving plan:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    try {
      // clear previous

      deletePlan(planToDelete.id, {
        onSuccess: () => {
          toast({
            title: "Deleted",
            description: "Subscription plan deleted successfully!",
            variant: "success",
          });
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
        },
        onError: (error: unknown) => {
          toast({
            title: "Delete failed",
            description:
              "Failed to delete subscription plan. Please try again.",
            variant: "destructive",
          });
          console.error("Error deleting plan:", error);
        },
      });
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  const handleFormCancel = () => {
    setCurrentView("list");
    setSelectedPlan(null);
  };

  // const clearMessages = () => {
  //   setSuccessMessage(null);
  //   setErrorMessage(null);
  // };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-700 sm:text-3xl sm:truncate">
            Subscription Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage subscription plans for your application
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {currentView === "list" && (
            <Button onClick={handleCreateNew}>Create New Plan</Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {/* messages are shown via toast */}

        {currentView === "list" ? (
          <SubscriptionPlanList onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <div>
            {isSubmitting && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <Spinner size="lg" />
              </div>
            )}
            <SubscriptionPlanForm
              plan={selectedPlan || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Subscription Plan"
        message={`Are you sure you want to delete the subscription plan "${planToDelete?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};
