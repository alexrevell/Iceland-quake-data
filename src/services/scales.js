import scaleLinear from 'd3-scale/src/linear'
import { pluck } from './utils'

const max = Math.max
const min = Math.min

export function buildXScale(data, width, padding) {
  const longitudes = data.map(pluck('longitude'))
  const longMin = min(...longitudes)
  const longMax = max(...longitudes)

  return buildLinearScale({
    domain: [ longMin, longMax ],
    range: [ padding, width - padding ],
  })
}

export function buildYScale(data, height, padding) {
  const latitudes = data.map(pluck('latitude'))
  const latMin = min(...latitudes)
  const latMax = max(...latitudes)

  return buildLinearScale({
    domain: [ latMin, latMax ],
    range: [ height - padding, padding ],
  })
}

export function buildRScale(data, height) {
  const sizes = data.map(pluck('size'))
  const maxSize = max(...sizes)

  return buildLinearScale({
    domain: [ 0, maxSize ],
    range: [ 0, height ],
  })
}

function buildLinearScale({ domain, range }) {
  return scaleLinear().domain(domain).range(range)
}
