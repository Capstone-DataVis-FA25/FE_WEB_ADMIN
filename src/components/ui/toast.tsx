import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ToastVariant = "default" | "success" | "destructive" | "info";

interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 8);
    const item: ToastItem = { id, ...t };
    setToasts((s) => [item, ...s]);
    if (t.duration !== 0) {
      const timeout = t.duration ?? 4000;
      setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), timeout);
    }
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

const variantClasses: Record<ToastVariant, string> = {
  default: "bg-card text-card-foreground border",
  success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  destructive:
    "bg-destructive/10 text-destructive border border-destructive/30",
  info: "bg-blue-50 text-blue-800 border border-blue-200",
};

const Toast: React.FC<ToastItem & { onClose: () => void }> = ({
  title,
  description,
  variant = "default",
  onClose,
}) => {
  return (
    <div
      className={cn(
        "rounded-lg p-3 shadow-md flex items-start gap-3",
        variantClasses[variant]
      )}
    >
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {description && (
          <div className="text-sm mt-1 opacity-90">{description}</div>
        )}
      </div>
      <button onClick={onClose} className="p-1 rounded-md hover:bg-muted/30">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
