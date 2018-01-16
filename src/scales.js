import scaleLinear from 'd3-scale/src/linear'

const max = Math.max
const min = Math.min

export function buildXScale(data, width, padding) {
  const longitudes = data.map(pluck('longitude'))

  return scaleLinear()
    .domain([
      min(...longitudes),
      max(...longitudes)
    ])
    .range([padding, width - padding])
}

export function buildYScale(data, height, padding) {
  const latitudes = data.map(pluck('latitude'))

  return scaleLinear([
    min(...latitudes),
    max(...latitudes),
  ])
   .range([height - padding, padding])
}

export function buildRScale(data, height) {
  return scaleLinear([
    0,
    max(...data.map(pluck('size')))
  ])
  .range([0, height / 100])
}

function pluck (attr) {
  return function (item) {
    return item[attr]
  }
}
