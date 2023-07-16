import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { deriveTime } from './helper'

beforeAll(() => {
  dayjs.extend(duration)
})

test('deriveTime can parse hours', () => {
  expect(deriveTime('1h', 's')).toBe(3600)
})

test('deriveTime can parse minutes', () => {
  expect(deriveTime('1m', 's')).toBe(60)
})

test('deriveTime can parse seconds', () => {
  expect(deriveTime('60s', 's')).toBe(60)
})

test('deriveTime can parse multiple units combined', () => {
  expect(deriveTime('1h1m1s100ms', 's')).toBe(3661.1)
})

test('deriveTime can parse seconds to milliseconds', () => {
  expect(deriveTime('1s', 'ms')).toBe(1000)
})

test('deriveTime can parse milliseconds to seconds', () => {
  expect(deriveTime('1000ms', 's')).toBe(1)
})
