
import { toast as sonnerToast } from "sonner";

// Simple direct export of the toast function
export const toast = sonnerToast;

// This hook is maintained for compatibility
export function useToast() {
  return {
    toast: sonnerToast
  };
}
