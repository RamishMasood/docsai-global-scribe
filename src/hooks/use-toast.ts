
import { toast } from "@/components/ui/use-toast";

export { toast };

export function useToast() {
  return {
    toast,
    toasts: [],
  };
}
