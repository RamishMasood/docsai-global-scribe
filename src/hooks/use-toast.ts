
// Import toast from sonner directly instead of from our custom hook
import { toast as sonnerToast } from "sonner";

// Export the toast function directly
export const toast = sonnerToast;

// Create a useToast hook that returns the toast function
export function useToast() {
  return {
    toast: sonnerToast,
    toasts: [], // Keeping this for compatibility with existing code
  };
}
