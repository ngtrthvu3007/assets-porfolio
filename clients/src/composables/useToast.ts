import { readonly, ref } from "vue";
import { TOAST_DURATION_MS } from "../constants/toast";
import type { ToastItem, ToastType } from "../types/toast";

const toasts = ref<ToastItem[]>([]);
let nextToastId = 1;

export const useToast = () => {
  const showToast = (message: string, type: ToastType = "info"): void => {
    const toast: ToastItem = {
      id: nextToastId,
      message,
      type,
    };

    nextToastId += 1;
    toasts.value = [...toasts.value, toast];

    window.setTimeout(() => {
      removeToast(toast.id);
    }, TOAST_DURATION_MS);
  };

  const showErrorToast = (message: string): void => {
    showToast(message, "error");
  };

  const removeToast = (id: number): void => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  return {
    removeToast,
    showErrorToast,
    showToast,
    toasts: readonly(toasts),
  };
};
