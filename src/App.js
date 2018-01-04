import React, { Component } from 'react';
import logo from './logo.svg';
import mapData from './data/iceland.json'
import './App.css';

const QUAKES_URL = 'https://apis.is/earthquake/is'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      quakes: []
    }
  }

  fetchQuakes = async () => {
    const res = await fetch(QUAKES_URL)
    const quakes = await res.json()
    // console.log('QUAKES:', quakes.results)

    this.setState({ quakes: quakes.results })
  }

  componentDidMount = () => {
    this.fetchQuakes()
  }

  render() {
    return (
      <div className='App'>

        <header className="tc pv1 pv2-ns">
          <h1 className="f5 f4-ns fw6 mid-gray">Iceland Quakes</h1>
          <img src={logo} className='App-logo' alt='logo' />
          <h2 className="f6 gray fw2 ttu tracked">Earthquakes from the past 48 hours</h2>
        </header>

        <div className='Map' style={{ textAlign: 'left' }}>
          <ul>
            {this.state.quakes.map(quake =>
              <li>
                <div>{quake.size}</div>
                <div>{quake.humanReadableLocation}</div>
                <div>{quake.timestamp}</div>
              </li>
            )}
          </ul>
        </div>

        <footer className="tc-l bg-right cover">
          <div className="w-100 ph3 pv1">
            <a className="link black-60 bg-white hover-purple inline-flex items-center ma2 tc br2 pa2" href="https://github.com/desnor/iceland-quakes" title="GitHub">
              <svg className="dib h2 w2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><path d="M8 0C3.58 0 0 3.582 0 8c0 3.535 2.292 6.533 5.47 7.59.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.083-.202-.358-1.015.077-2.117 0 0 .672-.215 2.2.82.638-.178 1.323-.266 2.003-.27.68.004 1.364.092 2.003.27 1.527-1.035 2.198-.82 2.198-.82.437 1.102.163 1.915.08 2.117.513.56.823 1.274.823 2.147 0 3.073-1.87 3.75-3.653 3.947.287.246.543.735.543 1.48 0 1.07-.01 1.933-.01 2.195 0 .215.144.463.55.385C13.71 14.53 16 11.534 16 8c0-4.418-3.582-8-8-8"/></svg>
              <span className="f6 ml3 pr2">View on GitHub</span>
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;

//     <div class="wrapper mw9 center ph3-ns">
//       <div class="bar-graph-container fl w-100 pa2">
//         <svg class="quakes-bar-graph"></svg>
//       </div>
//       <div class="map-container fl w-100 pa2">
//         <svg class="map-svg"></svg>
//         <svg class="quakes-svg"></svg>
//       </div>
//     </div>
