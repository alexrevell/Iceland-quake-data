import d3 from 'd3'

const QUAKES_URL = 'https://apis.is/earthquake/is'
const MAP_DATA = '../geo-data/iceland.json'

function getRealQuakes(quake){
  return quake.size >= 0
}

function getJson(url, callback){
  d3.json(url, callback)
}

function getMapData(){
  return new Promise((resolve, reject) => getJson(MAP_DATA, resolve))
}

export function extractQuakes(data){
  return data.results.filter(getRealQuakes)
}

export function getQuakesJson() {
  return new Promise((resolve, reject) => getJson(QUAKES_URL, resolve) )
}
