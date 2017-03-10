const MAP_DATA = '../geo-data/iceland.json'
const QUAKES_URL = 'https://apis.is/earthquake/is'
const HEIGHT = 600
const WIDTH = 1020
const SCATTER_PADDING = 20

getJson(MAP_DATA)
  .then(renderMap)

getJson(QUAKES_URL)
  .then(data => data.results)
  .then(quakes => quakes.filter(q => q.size >= 0))
  .then(renderQuakesMap)


/*
**
** MAPPING
**
*/

const mapSvg = d3.select('.map-container')
  .append('svg')
  .attr('class', 'map-svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)

const projection = d3.geoOrthographic()
  .center([0, 0])
  .rotate([21, -65])
  .scale(8000)
  .translate([WIDTH / 2, HEIGHT / 2])

const path = d3.geoPath().projection(projection)

function renderMap(iceland) {
  const subunits = topojson.feature(iceland, iceland.objects.subunits)

  mapSvg.selectAll('.subunit')
    .data(topojson.feature(iceland, iceland.objects.subunits).features)
    .enter().append('path')
    .attr('class', d => `subunit ${d.id}`)
    .attr('d', path)

  mapSvg.append('path')
    .datum(topojson.feature(iceland, iceland.objects.places))
    .attr('d', path)
    .attr('class', 'place')

  // Large towns / cities placename labels

  mapSvg.selectAll('.place-label')
    .data(topojson.feature(iceland, iceland.objects.places).features)
    .enter().append('text')
    .attr('class', 'place-label')
    .attr('transform', d => `translate(${projection(d.geometry.coordinates)})`)
    .attr('dy', '.35em')
    .text( d => d.properties.name )
    .attr('x', d => d.geometry.coordinates[0] > -22 ? 6 : -6)
    .style('text-anchor', d => d.geometry.coordinates[0] > -22 ? 'start' : 'end')

  // Iceland country text

  mapSvg.selectAll('.subunit-label')
    .data(topojson.feature(iceland, iceland.objects.subunits).features)
    .enter().append('text')
    .attr('class', d => `subunit-label ${d.id}`)
    .attr('transform', d => `translate(${path.centroid(d)})`)
    .attr('dy', '.35em')
    .text(d => d.properties.name)
}

function renderQuakesMap(quakes){
  let xScale = buildXScale(quakes, WIDTH, SCATTER_PADDING)
  let yScale = buildYScale(quakes, HEIGHT, SCATTER_PADDING)
  let rScale = d3.scaleLinear([0, d3.max(quakes, d => d.size )]).range([0, 10])

  mapSvg.selectAll('circle')
    .data(quakes)
    .enter()
    .append('circle')
    .attr('class', 'quake-location fade-in')
    .attr('transform', d => `translate(${projection([d.longitude, d.latitude])})`)
    .attr('r', d => rScale(d.size) )
    .attr('fill', d => `rgb(${d.size * 120},0,0)` )

  mapSvg.selectAll('text')
    .data(quakes)
    .enter()
    .append('text')
    .text(d => `${d.longitude}, ${d.latitude}` )
    .attr('transform', d => `translate(${projection([d.longitude, d.latitude])})`)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
}

function getJson(url){
  return new Promise((resolve, reject) => d3.json(url, resolve))
}

function buildXScale(data, width, padding) {
  return d3.scaleLinear([
    d3.min(data, d => d.longitude ),
    d3.max(data, d => d.longitude )
  ])
  .range([padding, width - padding * 4])
}

function buildYScale(data, height, padding) {
  return d3.scaleLinear([
    d3.min(data, d => d.latitude ),
    d3.max(data, d => d.latitude )
  ])
   .range([height - padding, padding])
}
