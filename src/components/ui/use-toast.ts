
// Import the toast function from sonner directly
import { toast } from "sonner";

// Re-export it for backward compatibility
export { toast };

// Create a stub for useToast that returns the toast function
export function useToast() {
  return {
    toast,
    toasts: []
  };
}
