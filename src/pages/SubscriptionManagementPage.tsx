import React, { useState } from "react";
import type {
  SubscriptionPlan,
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
} from "../types";
import { SubscriptionPlanList } from "../components/subscription-management/SubscriptionPlanList";
import { SubscriptionPlanForm } from "../components/subscription-management/SubscriptionPlanForm";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      setErrorMessage(null);

      if (selectedPlan) {
        // Update existing plan
        updatePlan(
          {
            id: selectedPlan.id,
            planData: planData as UpdateSubscriptionPlanDto,
          },
          {
            onSuccess: () => {
              setSuccessMessage("Subscription plan updated successfully!");
              setCurrentView("list");
            },
            onError: (error: unknown) => {
              setErrorMessage(
                "Failed to update subscription plan. Please try again."
              );
              console.error("Error updating plan:", error);
            },
          }
        );
      } else {
        // Create new plan
        createPlan(planData as CreateSubscriptionPlanDto, {
          onSuccess: () => {
            setSuccessMessage("Subscription plan created successfully!");
            setCurrentView("list");
          },
          onError: (error: unknown) => {
            setErrorMessage(
              "Failed to create subscription plan. Please try again."
            );
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
      setErrorMessage(null);

      deletePlan(planToDelete.id, {
        onSuccess: () => {
          setSuccessMessage("Subscription plan deleted successfully!");
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
        },
        onError: (error: unknown) => {
          setErrorMessage(
            "Failed to delete subscription plan. Please try again."
          );
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
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
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
        {successMessage && (
          <div className="mb-6">
            <Alert variant="success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}

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
