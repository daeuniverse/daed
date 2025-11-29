export interface NodeFormProps<T = unknown> {
  /** Callback when the form generates a valid link */
  onLinkGeneration: (link: string) => void
  /** Initial values for edit mode */
  initialValues?: T
}
