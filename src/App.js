import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import mapData from './data/iceland.json'
import './App.css';

const WIDTH = 1200
// const WIDTH = (() => document.querySelector('.App').offsetWidth || 1200)()
const HEIGHT = WIDTH * .5
const SCATTER_PADDING = 20
const BAR_PADDING = 1

const d3 = window.d3
const topojson = window.topojson

const MAP_DATA = './iceland.json'
const QUAKES_URL = 'https://apis.is/earthquake/is'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      quakes: [],
      count: 0,
      width: 1200,
      height: 600
    }
  }

  get projection() {
    return d3.geoOrthographic()
      .center([0, 0])
      .rotate([19, -65])
      .scale(this.state.width * 8)
      .translate([this.state.width / 2, this.state.height / 2])
  }

  fetchQuakes = async () => {
    const res = await fetch(QUAKES_URL)
    const { results: quakes } = await res.json()
    const realQuakes = quakes.filter(q => q.size >= 0)
    console.log('QUAKES:', quakes)

    this.setState({ quakes: realQuakes, count: realQuakes.length })
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize)
    this.fetchQuakes()
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const mapRef = ReactDOM.findDOMNode(this.mapRef)
    this.setState({ width: mapRef.offsetWidth, height: mapRef.offsetWidth / 2 })
  }

 renderLargeGraph = ({ quakes, height, width, padding }) => {
    const scaleHeight = d3.scaleLinear().domain([0, d3.max(quakes, d => d.size)]).range([0, height])

    return (
      <svg className='quakes-bar-graph' height={height} width={width}>
        { quakes.map((quake, i) => (
          <rect key={quake.timestamp}
            className='quake quake-bar fade-in'
            x={i * width / quakes.length}
            y={height - scaleHeight(quake.size)}
            width={width / quakes.length}
            height={scaleHeight(quake.size)}
            fill={`rgb(${quake.size * 120},0,0)`}
          >
            <title>{`Size ${quake.size} occured at ${quake.timestamp} ${quake.humanReadableLocation}`}</title>
          </rect>
        ))}
      </svg>
    )

        // .call(selection => transitionAttr({ // transition the height for 'growing' effect
        //   selection,
        //   attr: 'height',
        //   value: d => scaleHeight(d.size),
        //   delay: (d, i) => i * 50,
        //   duration: d => 50
        // }))

        // .on('mouseover', (d, i) => {
        //   d3.selectAll('.quake-location').filter((d, j) => j !== i).call(fadeOpacity, .1)
        //   d3.select(this).classed('shadow', true)
        //   quakesSvg.classed('shadow', true)
        // })
        // .on('mouseout', (d, i) => {
        //   d3.selectAll('.quake-location').filter((d, j) => j !== i).call(fadeOpacity, 1)
        //   d3.select(this).classed('shadow', false)
        //   quakesSvg.classed('shadow', false)
        // })
  }

  renderMap({ data: iceland, quakes, width, height, padding }) {
    const path = d3.geoPath().projection(this.projection)
    const subunits = topojson.feature(iceland, iceland.objects.subunits).features
    const places = topojson.feature(iceland, iceland.objects.places).features

    const xScale = buildXScale(quakes, width, padding)
    const yScale = buildYScale(quakes, height, padding)
    const rScale = d3.scaleLinear([0, d3.max(quakes, d => d.size )]).range([0, height / 100])


    return (
      <svg className='map-svg' height={height} width={width}>
        <Fragment>
          {subunits.map((feature, i) => (
            <Fragment key={`feature-${i}`}>
              <path className={`subunit ${feature.id}`} d={path(feature)}>
                <text className={`subunit-label ${feature.id}`}
                  transform={`translate(${path.centroid(feature)})`}
                  dy='.35em'
                >
                  {feature.properties.name}
                </text>
              </path>
            </Fragment>
          ))}
          {places.map((place, i) => (
            <Fragment key={`place-${i}`}>
              <path key={place.properties.name} className='place' d={path(place)} />
              <text key={`${place.properties.name}-${i}`} className='place-label'
                dy='.35em'
                x={place.geometry.coordinates[0] > -22 ? 6 : -6}
                transform={`translate(${this.projection(place.geometry.coordinates)})`}
                style={{ textAnchor: place.geometry.coordinates[0] > -22 ? 'start' : 'end'}}
              >
                {place.properties.name}
              </text>
            </Fragment>
          ))}
          {quakes.map((quake, i) => (
            <circle key={`quake-${i}`}
              className='quake quake-location'
              id={`quake-location-${quake.timestamp}`}
              fill={`rgb(${quake.size * 120},0,0)`}
              dx={xScale(quake.size)}
              dy={yScale(quake.size)}
              r={rScale(quake.size)}
              transform={`translate(${this.projection([quake.longitude, quake.latitude])})`}
            >
              <text>{quake.size}</text>
            </circle>
          ))}
        </Fragment>
      </svg>
    )
  }

  // renderQuakes({ quakes, height, width, padding }){
  //   let xScale = buildXScale(quakes, width, padding)
  //   let yScale = buildYScale(quakes, height, padding)
  //   let rScale = d3.scaleLinear([0, d3.max(quakes, d => d.size )]).range([0, 10])
  //
  //   // quake circles
  //
  //     // .on('mouseover', (d, i) => {
  //     //   fadeOpacity(d3.selectAll('.quake-bar').filter((d, j) => j !== i), .1)
  //     //   d3.select('.quakes-container').select('svg').classed('shadow', true)
  //     // })
  //     // .on('mouseout', (d, i) => {
  //     //   fadeOpacity(d3.selectAll('.quake-bar').filter((d, j) => j !== i), 1)
  //     //   d3.select('.quakes-container').select('svg').classed('shadow', false)
  //     // })
  //     // .call(selection => transitionAttr({
  //     //   selection,
  //     //   attr: 'r',
  //     //   value: d => rScale(d.size),
  //     //   delay: (d, i) => i * 50,
  //     //   duration: d => 50
  //     // }))


  render() {

    return (
      <div className='App'>
        <header className='tc pv1 pv2-ns'>
          <h1 className='f5 f4-ns fw6 mid-gray'>Iceland Quakes</h1>
          <img src={logo} className='App-logo' alt='logo' />
          <h2 className='f6 gray fw2 ttu tracked'>Earthquakes from the past 48 hours</h2>
        </header>
        <div className='f6 black fw3 ttu tracked'>total: {this.state.count}</div>
        <div className='f6 black fw3 ttu tracked'>largest: {Math.max(...this.state.quakes.map(q => q.size))}</div>

        <div className='Map center' ref={map => {this.mapRef = map}}>
          <div className='bar-graph-container'>
            { this.renderLargeGraph({ quakes: this.state.quakes, height: this.state.width / 4, width: this.state.width, padding: BAR_PADDING }) }
          </div>
          <div className='map-container'>
            { this.renderMap({ data: mapData, quakes: this.state.quakes, height: this.state.height, width: this.state.width, padding: SCATTER_PADDING }) }
          </div>
        </div>

        <footer className='tc-l bg-right cover'>
          <div className='w-100 ph3 pv1'>
            <a className='link black-60 bg-white hover-purple inline-flex items-center ma2 tc br2 pa2' href='https://github.com/desnor/iceland-quakes' title='GitHub'>
              <svg className='dib h2 w2' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fillRule='evenodd' clipRule='evenodd' strokeLinejoin='round' strokeMiterlimit='1.414'>
                <path d='M8 0C3.58 0 0 3.582 0 8c0 3.535 2.292 6.533 5.47 7.59.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.083-.202-.358-1.015.077-2.117 0 0 .672-.215 2.2.82.638-.178 1.323-.266 2.003-.27.68.004 1.364.092 2.003.27 1.527-1.035 2.198-.82 2.198-.82.437 1.102.163 1.915.08 2.117.513.56.823 1.274.823 2.147 0 3.073-1.87 3.75-3.653 3.947.287.246.543.735.543 1.48 0 1.07-.01 1.933-.01 2.195 0 .215.144.463.55.385C13.71 14.53 16 11.534 16 8c0-4.418-3.582-8-8-8'/>
              </svg>
              <span className='f6 ml3 pr2'>View on GitHub</span>
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;

// setInterval(() => {
  // getJson(MAP_DATA)
  //   .then(mapData => renderMap({ data: mapData, width: WIDTH, height: HEIGHT }))

  // getJson(QUAKES_URL)
  //   .then(quakes => {
  //     renderLargeGraph({ quakes, width: WIDTH, height: HEIGHT / 3, padding: BAR_PADDING })
  //     renderQuakeSpots({ quakes, width: WIDTH, height: HEIGHT, padding: SCATTER_PADDING })
  //   }).catch(err => console.error('Error:', err))
// }, 10000)

/*
**
** MAPPING
**
*/

const barGraphSvg = d3.select('.quakes-bar-graph')
const mapSvg = d3.select('.map-svg')
const quakesSvg = d3.select('.quakes-svg')

const projection = d3.geoOrthographic()
  .center([0, 0])
  .rotate([19, -65])
  .scale(WIDTH * 8)
  .translate([WIDTH / 2, HEIGHT / 2])

const path = d3.geoPath().projection(projection)

// function renderMap({ data: iceland, width, height }) {
//   const subunits = topojson.feature(iceland, iceland.objects.subunits)
//
//   mapSvg
//     .attr('width', width)
//     .attr('height', height)
//     .selectAll('.subunit')
//     .data(subunits.features)
//     .enter()
//     .append('path')
//     .attr('class', d => `subunit ${d.id}`)
//     .attr('d', path)
//
//   mapSvg.append('path')
//     .datum(topojson.feature(iceland, iceland.objects.places))
//     .attr('d', path)
//     .attr('class', 'place')
//
//   // Large towns / cities placename labels
//
//   mapSvg.selectAll('.place-label')
//     .data(topojson.feature(iceland, iceland.objects.places).features)
//     .enter().append('text')
//     .attr('class', 'place-label')
//     .attr('transform', d => `translate(${projection(d.geometry.coordinates)})`)
//     .attr('dy', '.35em')
//     .attr('x', d => d.geometry.coordinates[0] > -22 ? 6 : -6)
//     .style('text-anchor', d => d.geometry.coordinates[0] > -22 ? 'start' : 'end')
//     .text(d => d.properties.name)
//
//   // Iceland country text
//
//   mapSvg.selectAll('.subunit-label')
//     .data(topojson.feature(iceland, iceland.objects.subunits).features)
//     .enter().append('text')
//     .attr('class', d => `subunit-label ${d.id}`)
//     .attr('transform', d => `translate(${path.centroid(d)})`)
//     .attr('dy', '.35em')
//     .attr('font-family', 'sans-serif')
//     .attr('font-size', '14px')
//     .text(d => d.properties.name)
// }
//
// function renderLargeGraph ({ quakes, height, width, padding }) {
//   const scaleHeight = d3.scaleLinear([0, d3.max(quakes, d => d.size)]).range([0, height - d3.max(quakes, d => d.size)])
//
//   barGraphSvg
//     .attr('height', height)
//     .attr('width', width)
//
//   const rects = barGraphSvg.selectAll('rect')
//       .data(quakes)
//       .enter()
//       .append('rect')
//       .attr('class', 'quake quake-bar fade-in')
//       .attr('x', (d, i) => i * width / quakes.length)
//       .attr('y', d => height - scaleHeight(d.size))
//       .attr('width', width / quakes.length)
//       .call(selection => transitionAttr({ // transition the height for 'growing' effect
//         selection,
//         attr: 'height',
//         value: d => scaleHeight(d.size),
//         delay: (d, i) => i * 50,
//         duration: d => 50
//       }))
//       .attr('fill', d => `rgb(${d.size * 120},0,0)` )
//
//       .on('mouseover', (d, i) => {
//         d3.selectAll('.quake-location').filter((d, j) => j !== i).call(fadeOpacity, .1)
//         d3.select(this).classed('shadow', true)
//         quakesSvg.classed('shadow', true)
//       })
//       .on('mouseout', (d, i) => {
//         d3.selectAll('.quake-location').filter((d, j) => j !== i).call(fadeOpacity, 1)
//         d3.select(this).classed('shadow', false)
//         quakesSvg.classed('shadow', false)
//       })
//       .append('title')
//         .text(d => `Size ${d.size} occured at ${d.timestamp} ${d.humanReadableLocation}`)
//
// }

// function renderQuakeSpots({ quakes, height, width, padding }){
//   let xScale = buildXScale(quakes, width, padding)
//   let yScale = buildYScale(quakes, height, padding)
//   let rScale = d3.scaleLinear([0, d3.max(quakes, d => d.size )]).range([0, 10])
//
//   // quake circles
//
//   quakesSvg
//     .attr('height', height)
//     .attr('width', width)
//     .style('position', 'relative')
//     .style('top', -height)
//     .selectAll('circle')
//     .data(quakes)
//     .enter()
//     .append('circle')
//     .attr('class', 'quake quake-location fade-in')
//     .attr('id', d => `quake-location-${d.timestamp}`)
//     .attr('fill', d => `rgb(${d.size * 120},0,0)`)
//     .attr('dx', d => xScale(d.size))
//     .attr('dy', d => yScale(d.size))
//     .attr('transform', d => `translate(${projection([d.longitude, d.latitude])})`)
//     .on('mouseover', (d, i) => {
//       fadeOpacity(d3.selectAll('.quake-bar').filter((d, j) => j !== i), .1)
//       d3.select('.quakes-container').select('svg').classed('shadow', true)
//     })
//     .on('mouseout', (d, i) => {
//       fadeOpacity(d3.selectAll('.quake-bar').filter((d, j) => j !== i), 1)
//       d3.select('.quakes-container').select('svg').classed('shadow', false)
//     })
//     .call(selection => transitionAttr({
//       selection,
//       attr: 'r',
//       value: d => rScale(d.size),
//       delay: (d, i) => i * 50,
//       duration: d => 50
//     }))
//     .append('title').text(d => d.size)
//
// }
//
// window.updateSize = function updateSize(width) {
//   [ '.quakes-bar-graph', '.map-svg', '.quakes-svg' ].forEach(item => {
//     d3.select(item)
//       .style('width', width)
//       .style('height', width * .5)
//   })
//
//   projection
//     .scale(width * 8)
//     .translate([width / 2, (width / 2) * .5])
// }

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

function buildYScaleBars(data, height, padding) {
  return d3.scaleLinear([
    d3.min(data, d => d.size ),
    d3.max(data, d => d.size )
  ])
   .range([height - padding, padding])
}
