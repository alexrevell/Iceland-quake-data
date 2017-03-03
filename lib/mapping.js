import d3 from 'd3'
import { feature } from 'topojson'

let svgHeight = 300
let svgWidth = 500
let barPadding = 1
let scatterPadding = 20

function buildXScale(data, width, padding) {
  return d3.scale.linear()
    .domain([
      d3.min(data, d => d.longitude ),
      d3.max(data, d => d.longitude )
    ])
    .range([padding, width - padding * 4])
}

function buildYScale(data, height, padding) {
  return d3.scale.linear()
    .domain([
      d3.min(data, d => d.latitude ),
      d3.max(data, d => d.latitude )
    ])
   .range([height - padding, padding])
}

function renderSmallGraph(quakes) {
  let quakesDiv = d3.select('.quake-events').selectAll('div')
    .data(quakes)
    .enter()
    .append('div')
    .attr('class', 'bar')
    .style('background-color','red')
    .style('height', d => (d.size * 30) + 'px')
    .style('width', '10px')
}

function renderLargeGraph (quakes, svgHeight, svgWidth, barPadding) {
  let svg = d3.select('.container-quakes')
          .append('svg')
          .attr('height', svgHeight)
          .attr('width', svgWidth)
          .attr('class', 'quake-canvas')

  svg.selectAll('rect')
      .data(quakes)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * svgWidth / quakes.length )
      .attr('y', d => svgHeight - d.size * 80 )
      .attr('height', d => d.size * 80 )
      .attr('width', svgWidth / quakes.length - barPadding)
      .attr('fill', d => `rgb(${d.size * 120},0,0)` )

  svg.selectAll('text')
     .data(quakes)
     .enter()
     .append('text')
     .text((d, i) => d.size)
     .attr('x', (d, i) => i * (svgWidth / quakes.length) + (svgWidth / quakes.length - barPadding) / 2 )
     .attr('y', (d, i) => svgHeight - d.size * 80 + 10 )
     .attr('text-anchor', 'middle')
     .attr('font-family', 'sans-serif')
     .attr('font-size', '10px')
     .attr('fill', 'white')

  svg.append('text')
     .text('Earthquakes by size over last 48 hours')
     .attr('x', 20)
     .attr('y', 100)
}

function renderQuakesMap(quakes, svgHeight, svgWidth, scatterPadding){

  let svgMap = d3.select('.container-quakes')
             .append('svg')
             .attr('height', svgHeight)
             .attr('width', svgWidth)
             .attr('class', 'quake-map-canvas')

  let xScale = buildXScale(quakes, svgWidth, scatterPadding)
  let yScale = buildYScale(quakes, svgHeight, scatterPadding)
  let rScale = d3.scale.linear().domain([0, d3.max(quakes, d => d.size )]).range([0, 10])

  svgMap.selectAll('circle')
        .data(quakes)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.longitude) )
        .attr('cy', d => yScale(d.latitude) )
        .attr('r', d => rScale(d.size) )
        .attr('fill', d => `rgb(${d.size * 120},0,0)` )

  svgMap.selectAll('text')
        .data(quakes)
        .enter()
        .append('text')
        .text(d => `${d.longitude}, ${d.latitude}` )
        .attr('x', d => xScale(d.longitude) )
        .attr('y', d => yScale(d.latitude) )
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')

  svgMap.append('text')
        .text('Earthquake size by latitude & longitude')
        .attr('x', 20)
        .attr('y', 100)
}

// export function renderMap(iceland) {
//
//   const height = 1160
//   const width = 960
//   const mapSvg = d3.select('.map-container').append('svg')
//   .attr('width', width)
//   .attr('height', height)
//
//   const subunits = feature(iceland, iceland.objects.subunits)
//   // const projection = d3.geo.albers()
//   //   .center([-21, 64])
//   //   .rotate([0, 0])
//   //   .parallels([50, 60])
//   //   .scale(6000)
//   //   .translate([width / 2, height / 2])
//   const projection = d3.geo.mercator()
//     .scale(500)
//     .translate([width / 2, height / 2])
//   const path = d3.geo.path().projection(projection)
//
//   mapSvg.append('path')
//     .datum(subunits)
//     .attr('d', path)
// }

export function renderMap(iceland) {
  const height = 580
  const width = 780
  const mapSvg = d3.select('.map-container').append('svg')
  .attr('width', width)
  .attr('height', height)

  const subunits = topojson.feature(iceland, iceland.objects.subunits)
  const projection = d3.geo.albers()
    .center([-21, 64])
    .rotate([0, 0])
    .parallels([60, 70])
    .scale(6000)
    .translate([width / 2, height / 2])
  // const projection = d3.geo.mercator()
  //   .scale(500)
  //   .translate([width / 2, height / 2])
  const path = d3.geo.path().projection(projection)

  mapSvg.append("path")
    .datum(topojson.feature(iceland, iceland.objects.subunits))
    .attr("d", path)

  // mapSvg.append('path')
  //   .datum(subunits)
  //   .attr('d', path)
}

export function renderQuakes(quakes) {
  renderSmallGraph(quakes)
  renderLargeGraph(quakes, svgHeight, svgWidth, barPadding)
  renderQuakesMap(quakes, svgHeight, svgWidth, scatterPadding)
}

export function removeQuakes() {
  let container = d3.select('.container-quakes')
  let quakesDiv = d3.select('.quake-events')
  container.remove()
  quakesDiv.remove()
}
