import * as React from "react";
import { Switch } from "@/components/ui/switch";

interface LabeledSwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const LabeledSwitch = ({
  label,
  checked,
  onCheckedChange,
  className,
  ...props
}: LabeledSwitchProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} {...props} />
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
};

export { LabeledSwitch };
