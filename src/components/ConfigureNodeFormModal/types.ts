export interface NodeFormProps<T = unknown> {
  /** Callback when the form generates a valid link */
  onLinkGeneration: (link: string) => void
  /** Initial values for edit mode */
  initialValues?: T
  /** Container element to portal FormActions into (for fixed footer) */
  actionsPortal?: HTMLElement | null
}
