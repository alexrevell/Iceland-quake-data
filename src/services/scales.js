import scaleLinear from 'd3-scale/src/linear'
import { mapAttrs, max, min, over, pipe } from './utils'

const minMax = over(min, max)

export function buildXScale(data, width, padding) {
  const [ min, max ] = pipe(
    mapAttrs('longitude'),
    minMax,
  )(data)

  return buildLinearScale({
    domain: [ min, max ],
    range: [ padding, width - padding ],
  })
}

export function buildYScale(data, height, padding) {
  const [ min, max ] = pipe(
    mapAttrs('latitude'),
    minMax,
  )(data)

  return buildLinearScale({
    domain: [ min, max ],
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
