import dayjs from 'dayjs'
import { DurationUnitType } from 'dayjs/plugin/duration'

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

const r = new RegExp('([0-9]+)([a-z]+)')

export const deriveTime = (timeStr: string, outputUnit: 'ms' | 's') => {
  const execRes = r.exec(timeStr)

  if (!execRes) {
    return 0
  }

  return dayjs
    .duration(Number.parseInt(execRes[1]), execRes[2] as DurationUnitType)
    .as(outputUnit === 'ms' ? 'milliseconds' : 'seconds')
}
