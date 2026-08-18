export interface BreadcrumbEntry {
  label: string
  to?: string
}

export const useBreadcrumbs = () => {
  const breadcrumbs = useState<BreadcrumbEntry[]>("breadcrumbs", () => [])

  const setBreadcrumbs = (entries: BreadcrumbEntry[]): void => {
    breadcrumbs.value = entries
  }

  return { breadcrumbs, setBreadcrumbs }
}
