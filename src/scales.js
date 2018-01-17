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

  return scaleLinear()
    .domain([
      min(...latitudes),
      max(...latitudes),
    ])
   .range([height - padding, padding])
}

export function buildRScale(data, height) {
  return scaleLinear()
    .domain([
      0,
      max(...data.map(pluck('size')))
    ])
    .range([0, height])
}

function pluck (attr) {
  return function (item) {
    return item[attr]
  }
}
