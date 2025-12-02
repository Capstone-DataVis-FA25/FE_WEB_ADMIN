import * as React from "react";
import { Textarea } from "@/components/ui/textarea";

interface LabeledTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const LabeledTextarea = ({
  label,
  error,
  className,
  ...props
}: LabeledTextareaProps) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Textarea {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export { LabeledTextarea };
