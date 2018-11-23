import { geoOrthographic, geoPath } from 'd3-geo'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { feature } from 'topojson'

import { buildXScale, buildYScale, buildRScale } from './services/scales'
import logo from './richter.svg'
import mapData from './data/iceland.json'
import Place from './components/Place'
import Rect from './components/Rect'

import './App.scss'

const QUAKES_URL = 'https://apis.is/earthquake/is'
const SCATTER_PADDING = 20
const INITIAL_WIDTH = document.body.clientWidth * .8

class App extends Component {
  state = {
    quakes: [],
    count: 0,
    width: INITIAL_WIDTH,
    height: INITIAL_WIDTH / 2
  }

  get projection() {
    return geoOrthographic()
      .center([0, 0])
      .rotate([19, -65])
      .scale(this.state.width * 8)
      .translate([this.state.width / 2, this.state.height / 2])
  }

  fetchQuakes = async () => {
    const res = await fetch(QUAKES_URL)
    const { results: quakes } = await res.json()
    const realQuakes = quakes.filter(q => q.size >= 0)

    this.setState({ quakes: realQuakes, count: realQuakes.length })
  }

  componentDidMount = () => {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    this.fetchQuakes()
    this.interval = setInterval(this.fetchQuakes, 1000 * 60)
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const mapRef = ReactDOM.findDOMNode(this.mapRef)
    this.setState({ width: mapRef.offsetWidth, height: mapRef.offsetWidth / 2 })
  }

 renderLargeGraph = ({ quakes, count, height, width }) => {
    const scaleHeight = buildRScale(quakes, height)

    return (
      <svg className='quakes-bar-graph' height={height} width={width}>
        { quakes.map(({ humanReadableLocation, size, timestamp }, i) => (
          <Rect
            className='quake quake-bar'
            fill={`rgb(${size * 120},0,0)`}
            height={scaleHeight(size)}
            key={timestamp}
            width={width / count}
            x={i * width / count}
            y={height - scaleHeight(size)}
          >
            <title>{`Size ${size} occured at ${timestamp} ${humanReadableLocation}`}</title>
          </Rect>
        ))}
      </svg>
    )
  }

  renderMap = ({ data: iceland, quakes, width, height, padding }) => {
    const path = geoPath().projection(this.projection)
    const subunits = feature(iceland, iceland.objects.subunits).features
    const places = feature(iceland, iceland.objects.places).features

    const xScale = buildXScale(quakes, width, padding)
    const yScale = buildYScale(quakes, height, padding)
    const rScale = buildRScale(quakes, height / 50)

    return (
      <svg className='map-svg' height={height} width={width}>
        <g>
          {subunits.map((feature, i) => (
            <g key={`feature-${i}`}>
              <path className={`subunit ${feature.id}`} d={path(feature)} />
              <text className={`subunit-label ${feature.id}`}
                transform={`translate(${path.centroid(feature)})`}
                dy='.35em'
              >
                {feature.properties.name}
              </text>
            </g>
          ))}
          {places.map(place => (
            <Place
              coordinates={place.geometry.coordinates}
              data={path(place)}
              key={place.properties.name}
              name={place.properties.name}
              textTransform={`translate(${this.projection(place.geometry.coordinates)})`}
            >
              <text className={`place-label ${place.geometry.coordinates[0] > -22 ? 'start' : 'end'}`}
                dy='.35em'
                x={place.geometry.coordinates[0] > -22 ? 6 : -6}
              />
            </Place>
          ))}
          {quakes.map((quake, i) => (
            // TODO: Circle component
            <circle key={`quake-${i}`}
              className='quake quake-location'
              id={`quake-location-${quake.timestamp}`}
              fill={`rgb(${Math.round(quake.size / Math.max(...quakes.map(q => q.size)) * 255)},0,0)`}
              dx={xScale(quake.size)}
              dy={yScale(quake.size)}
              r={rScale(quake.size)}
              transform={`translate(${this.projection([quake.longitude, quake.latitude])})`}
            >
              <text>{quake.size}</text>
            </circle>
          ))}
        </g>
      </svg>
    )
  }

  render = () => (
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
          { this.renderLargeGraph({ quakes: this.state.quakes, count: this.state.count, height: this.state.width / 4, width: this.state.width }) }
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
        <div className='w-100 ph3 pv1'>
          <a className='link black-60 bg-white hover-purple inline-flex items-center ma2 tc br2 pa2' href='https://thenounproject.com/viral.faisalovers' title='Noun Project'>
            <span className='f6 ml3 pr2'>
              Seismometer icon created by Viral faisalovers from the Noun Project
            </span>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
