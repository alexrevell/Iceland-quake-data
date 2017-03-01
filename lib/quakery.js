import d3 from 'd3'

function getRealQuakes(quake){
  return quake.size >= 0
}

function getQuakes(url, callback){
  d3.json(url, callback)
}

export function extractQuakes(data){
  return data.results.filter(getRealQuakes)
}

export function getQuakesJson(url) {
  return new Promise((resolve, reject) => getQuakes(url, resolve) )
}

export const quakesURL = "https://apis.is/earthquake/is"
