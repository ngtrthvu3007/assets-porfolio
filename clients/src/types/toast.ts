export type ToastType = "error" | "info" | "success" | "warning";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}
