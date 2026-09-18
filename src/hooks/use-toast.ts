import { toast as sonnerToast } from "sonner"

type Toast = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

const toast = ({ title, description, variant = "default", action }: Toast) => {
  if (variant === "destructive") {
    sonnerToast.error(title, {
      description,
      action,
    });
  } else {
    sonnerToast(title, {
      description,
      action,
    });
  }
};

export { useToast, toast };

// Dummy useToast hook to not break imports
function useToast() {
  return { toast };
}
