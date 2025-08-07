import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-100 text-blue-800",
        secondary: "border-transparent bg-gray-100 text-gray-800",
        success: "border-transparent bg-green-100 text-green-800",
        warning: "border-transparent bg-yellow-100 text-yellow-800",
        error: "border-transparent bg-red-100 text-red-800",
        outline: "border-gray-300 text-gray-800",
        pending: "border-transparent bg-orange-100 text-orange-800",
        submitted: "border-transparent bg-blue-100 text-blue-800",
        under_review: "border-transparent bg-purple-100 text-purple-800",
        resolved: "border-transparent bg-green-100 text-green-800",
        rejected: "border-transparent bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

// Helper function to get badge variant based on dispute status
export const getDisputeStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "pending";
    case "submitted":
      return "submitted";
    case "under_review":
      return "under_review";
    case "resolved":
      return "resolved";
    case "rejected":
      return "rejected";
    default:
      return "default";
  }
};

// Helper function to get badge variant based on credit score
export const getCreditScoreVariant = (score: number) => {
  if (score >= 750) return "success";
  if (score >= 700) return "default";
  if (score >= 650) return "warning";
  return "error";
};

export { Badge, badgeVariants };
