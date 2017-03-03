import { renderQuakes, renderMap, removeQuakes } from './mapping'
import { getQuakesJson, extractQuakes, getMapData } from './quakery'

let currentQuakes
let latestQuakes

getInitialQuakes()
pollForQuakes()

function pollForQuakes(){
  setInterval( () => getAndDisplayQuakes(), 300 * 1000 )
}

function getAndDisplayQuakes(){
  getQuakesJson().then(extractQuakes).then(checkForChange)
}

function getInitialQuakes(){
  getMapData().then(renderMap).catch(logError)
  getQuakesJson().then(extractQuakes).then(assignCurrentQuakes).then(renderQuakes).catch(logError)
}

function logError(request) {
  Error("Quake data didn't load successfully; error:" + request.statusText)
}

function assignCurrentQuakes(quakes){
  return currentQuakes = quakes
}

function checkForChange(latestQuakes){
  if (currentQuakes[0]['timestamp'] === latestQuakes[0]['timestamp']) {
    assignCurrentQuakes(latestQuakes)
    noChange(latestQuakes)
  }
  else {
    assignCurrentQuakes(latestQuakes)
    updateQuakesDisplay(latestQuakes)
  }
}

function noChange(quakes){
  console.log("no change, quakes:", quakes)
  return quakes
}

function updateQuakesDisplay(quakes) {
  console.log("new quakes have happened ! current latest:", currentQuakes[0], "new latest: ", quakes[0])
  removeQuakes()
  renderQuakes(quakes)
  return quakes
}
