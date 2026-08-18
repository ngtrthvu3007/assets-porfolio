import { toast } from "vue-sonner"
import { DEFAULT_TOAST_DURATION_MS } from "@/constants/default"
import type { ToastType } from "@/types/toast"

export const useToast = () => {
  const showToast = (message: string, type: ToastType = "info"): void => {
    toast[type](message, { duration: DEFAULT_TOAST_DURATION_MS })
  }

  const showErrorToast = (message: string): void => {
    showToast(message, "error")
  }

  return { showErrorToast, showToast }
}
