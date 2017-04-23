const MAP_DATA_FILE = './iceland.json'
const QUAKES_URL = 'https://apis.is/earthquake/is'
const WIDTH = document.querySelector('.map-container').offsetWidth
const HEIGHT = WIDTH * .5
const SCATTER_PADDING = 20
const BAR_PADDING = 1

getJson(MAP_DATA_FILE)
  .then(renderMap)

getJson(QUAKES_URL)
  .then(data => data.results)
  .then(quakes => quakes.filter(q => q.size >= 0))
  .then(quakes => {
    renderQuakesMap(quakes)
    renderLargeGraph({ quakes, width: WIDTH, height: 120, padding: BAR_PADDING })
  }).catch(err => console.error('Error:', err))

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

const quakesSvg = d3.select('.container-quakes')
  .append('svg')
  .attr('class','quakes-svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)

const projection = d3.geoOrthographic()
  .center([0, 0])
  .rotate([19, -65])
  .scale(8000)
  .translate([WIDTH / 2, HEIGHT / 2])

const path = d3.geoPath().projection(projection)

function renderMap(iceland) {
  const subunits = topojson.feature(iceland, iceland.objects.subunits)

  mapSvg.selectAll('.subunit')
    .data(subunits.features)
    .enter()
    .append('path')
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
    .attr('x', d => d.geometry.coordinates[0] > -22 ? 6 : -6)
    .style('text-anchor', d => d.geometry.coordinates[0] > -22 ? 'start' : 'end')
    .text(d => d.properties.name)

  // Iceland country text

  mapSvg.selectAll('.subunit-label')
    .data(topojson.feature(iceland, iceland.objects.subunits).features)
    .enter().append('text')
    .attr('class', d => `subunit-label ${d.id}`)
    .attr('transform', d => `translate(${path.centroid(d)})`)
    .attr('dy', '.35em')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '14px')
    .text(d => d.properties.name)
}

function renderQuakesMap(quakes){
  let xScale = buildXScale(quakes, WIDTH, SCATTER_PADDING)
  let yScale = buildYScale(quakes, HEIGHT, SCATTER_PADDING)
  let rScale = d3.scaleLinear([0, d3.max(quakes, d => d.size )]).range([0, 10])

  // quake circles

  quakesSvg.selectAll('circle')
    .data(quakes)
    .enter()
    .append('circle')
    .attr('class', 'quake quake-location fade-in')
    .attr('id', d => `quake-location-${d.timestamp}`)
    .attr('fill', d => `rgb(${d.size * 120},0,0)`)
    .attr('transform', d => `translate(${projection([d.longitude, d.latitude])})`)
    .on('mouseover', (d, i) => {
      fadeOpacity(d3.selectAll('.quake-bar').filter((d, j) => j !== i), .1)
      d3.select('.container-quakes').select('svg').classed('shadow', true)
    })
    .on('mouseout', (d, i) => {
      fadeOpacity(d3.selectAll('.quake-bar').filter((d, j) => j !== i), 1)
      d3.select('.container-quakes').select('svg').classed('shadow', false)
    })
    .call(selection => transitionAttr({
      selection,
      attr: 'r',
      value: d => rScale(d.size),
      delay: (d, i) => i * 450,
      duration: d => 2000
    }))
    .append('title').text(d => d.size)

}

function renderLargeGraph ({ quakes, height, width, padding }) {
  let barGraphSvg = d3.select('.quake-events-navigation')
          .append('svg')
          .attr('height', height)
          .attr('width', width)
          .attr('class', 'quakes-bar-graph')

  const rects = barGraphSvg.selectAll('rect')
      .data(quakes)
      .enter()
      .append('rect')
      .attr('class', 'quake quake-bar fade-in')
      .attr('x', (d, i) => i * WIDTH / quakes.length)
      .attr('y', d => height - d.size * 40 )
      .attr('width', width / quakes.length)
      .call(selection => transitionAttr({ // transition the height for 'growing' effect
        selection,
        attr: 'height',
        value: d => d.size * 40,
        delay: (d, i) => i * 450,
        duration: d => 2000
      }))
      .attr('fill', d => `rgb(${d.size * 120},0,0)` )

      .on('mouseover', (d, i) => {
        d3.selectAll('.quake-location').filter((d, j) => j !== i).call(fadeOpacity, .1)
        mapSvg.classed('shadow', true)
      })
      .on('mouseout', (d, i) => {
        d3.selectAll('.quake-location').filter((d, j) => j !== i).call(fadeOpacity, 1)
        mapSvg.classed('shadow', false)
      })
      .append('title')
        .text(d => `Size ${d.size} occured at ${d.timestamp} ${d.humanReadableLocation}`)

  // svg.selectAll('text')
  //    .data(quakes)
  //    .enter()
  //    .append('text')
  //    .text((d, i) => d.size)
  //    .attr('x', (d, i) => i * (width / quakes.length) + (width / quakes.length - barPadding) / 2 )
  //    .attr('y', (d, i) => height - d.size * 80 + 10 )
  //    .attr('text-anchor', 'middle')
  //    .attr('font-family', 'sans-serif')
  //    .attr('font-size', '10px')
  //    .attr('fill', 'white')

}

function transitionAttr({ selection, attr, value, delay=450, duration=450 }) {
  selection
    .transition()
    .delay(typeof delay === 'function' ? (d,i) => delay(d,i) : delay)
    .duration(typeof duration === 'function' ? (d, i) => duration(d,i) : duration)
    .attr(attr, typeof value === 'function' ? (d) => value(d) : value)
}

function fadeOpacity(selection, value) {
  selection
    .transition()
    .style('opacity', value)
}

function getJson(url){
  return new Promise((resolve, reject) => d3.json(url, resolve))
}

function buildXScale(data, width, padding) {
  return d3.scaleLinear([
    d3.min(data, d => d.longitude ),
    d3.max(data, d => d.longitude )
  ])
  .range([padding, width - padding])
}

function buildYScale(data, height, padding) {
  return d3.scaleLinear([
    d3.min(data, d => d.latitude ),
    d3.max(data, d => d.latitude )
  ])
   .range([height - padding, padding])
}
