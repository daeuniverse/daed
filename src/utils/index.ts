export class Defer<T> {
  promise: Promise<T>
  resolve?: (value: T | PromiseLike<T>) => void
  reject?: (reason?: unknown) => void

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export const fileToBase64 = (file: File) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)

  const defer = new Defer<string>()

  reader.onload = () => {
    if (defer.resolve) {
      defer.resolve(reader.result as string)
    }
  }

  reader.onerror = (err) => {
    if (defer.reject) {
      defer.reject(err)
    }
  }

  return defer.promise
}
