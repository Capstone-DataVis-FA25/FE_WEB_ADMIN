import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/50 text-green-500 dark:border-green-500 [&>svg]:text-green-500",
        warning:
          "border-yellow-500/50 text-yellow-500 dark:border-yellow-500 [&>svg]:text-yellow-500",
        info: "border-blue-500/50 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const alertTitleVariants = cva("mb-1 font-medium leading-none tracking-tight");

const alertDescriptionVariants = cva("text-sm [&_p]:leading-relaxed");

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = ({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>) => (
  <div
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
);

const AlertTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5 className={cn(alertTitleVariants(), className)} {...props} />
);

const AlertDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div className={cn(alertDescriptionVariants(), className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
