export function map(fn) {
  return xs => xs.map(fn)
}

export const max = Math.max

export const min = Math.min

export function pipe(...fns) {
  return (...args) => fns.reduce((acc, fn) => fn(acc), ...args)
}

export function pluck(...attrs) {
  return item => attrs.reduce((acc, key) => acc[key], item)
}
