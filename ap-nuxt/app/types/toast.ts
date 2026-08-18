export type ToastType = "error" | "info" | "success" | "warning"

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}
