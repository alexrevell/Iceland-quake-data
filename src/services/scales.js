import scaleLinear from 'd3-scale/src/linear'
import { map, max, min, pluck } from './utils'

export function buildXScale(data, width, padding) {
  const longitudes = mapAttrs('longitude')(data)
  const longMin = min(...longitudes)
  const longMax = max(...longitudes)

  return buildLinearScale({
    domain: [ longMin, longMax ],
    range: [ padding, width - padding ],
  })
}

export function buildYScale(data, height, padding) {
  const latitudes = mapAttrs('latitude')(data)
  const latMin = min(...latitudes)
  const latMax = max(...latitudes)

  return buildLinearScale({
    domain: [ latMin, latMax ],
    range: [ height - padding, padding ],
  })
}

export function buildRScale(data, height) {
  const sizes = mapAttrs('size')(data)
  const maxSize = max(...sizes)

  return buildLinearScale({
    domain: [ 0, maxSize ],
    range: [ 0, height ],
  })
}

function buildLinearScale({ domain, range }) {
  return scaleLinear().domain(domain).range(range)
}

function mapAttrs(...attr) {
  return map(pluck(...attr))
}
