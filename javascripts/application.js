var IcelandQuakes = (function(){
  var quakesDiv
  var svg
  var svgMap
  var svgHeight = 300
  var svgWidth = 500
  var barPadding = 1
  var scatterPadding = 20
  var currentQuakes
  var latestQuakes
  var quakesURL = "https://apis.is/earthquake/is"

  var bindEventListeners = function () {
    getInitialQuakes(quakesURL)
    pollForQuakes(quakesURL)
  }

  function pollForQuakes(url){
    setInterval( function(){
      getAndDisplayQuakes(url)
    }, 300 * 1000 )
  }

  function getAndDisplayQuakes(url){
    getQuakesJson(url).then(extractQuakes).then(checkForChange)
  }

  function getInitialQuakes(url){
    getQuakesJson(url).then(extractQuakes).then(assignCurrentQuakes).then(renderQuakes).catch(logError)
  }

  function logError(request) {
    Error("Quake data didn't load successfully; error code:" + request.statusText)
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
  }

  function updateQuakesDisplay(quakes) {
    console.log("new quakes have happened ! current:", currentQuakes, "new quakes: ", quakes)
    quakesDiv.remove()
    svg.remove()
    svgMap.remove()
    renderQuakes(quakes)
    return quakes
  }

  function getQuakesJson(url) {
    return new Promise( function(resolve, reject){
      getQuakes(url, resolve)
    })
  }

  function getQuakes(url, callback){
    d3.json(url, callback)
  }

  function extractQuakes(data){
    return data.results.filter(getRealQuakes)
  }

  function getRealQuakes(quake){
    return quake.size >= 0
  }

  function renderQuakes(quakes) {
    renderLargeGraph(quakes)
    renderSmallGraph(quakes)
    renderQuakesMap(quakes)
  }

  function renderSmallGraph(quakes) {
    quakesDiv = d3.select('.quake-events').selectAll('div')
      .data(quakes)
      .enter()
      .append('div')
      .attr('class', 'bar')
      .style("background-color","red")
      .style('height', function(d){ return (d.size * 30) + 'px' })
      .style('width', '10px')
  }

  function renderLargeGraph(quakes) {
    svg = d3.select('.container-quakes')
            .append('svg')
            .attr('height', svgHeight)
            .attr('width', svgWidth)
            .attr('class', 'quake-canvas')

    svg.selectAll('rect')
        .data(quakes)
        .enter()
        .append('rect')
        .attr('x', function(d, i){ return i * svgWidth / quakes.length })
        .attr('y', function(d){ return svgHeight - d.size * 80 })
        .attr('height', function(d){ return d.size * 80 })
        .attr('width', svgWidth / quakes.length - barPadding)
        .attr('fill', function(d){ return "rgb("+ (d.size * 120) +",0,0)" })

    svg.selectAll('text')
       .data(quakes)
       .enter()
       .append('text')
       .text(function(d, i){ return d.size })
       .attr('x', function(d, i){
          return i * (svgWidth / quakes.length) + (svgWidth / quakes.length - barPadding) / 2
        })
       .attr('y', function(d, i){ return svgHeight - d.size * 80 + 10 })
       .attr('text-anchor', 'middle')
       .attr('font-family', 'sans-serif')
       .attr('font-size', '10px')
       .attr('fill', 'white')

    svg.append('text')
       .text('Earthquakes by size over last 48 hours')
       .attr('x', 20)
       .attr('y', 100)
  }

  function buildXScale(data, width, padding) {
    return d3.scale.linear()
      .domain([
        d3.min(data, function(d){ return d.longitude }),
        d3.max(data, function(d){ return d.longitude })
      ])
      .range([padding, width - padding * 4])
  }

  function buildYScale(data, height, padding) {
    return d3.scale.linear()
      .domain([
        d3.min(data, function(d){ return d.latitude }),
        d3.max(data, function(d){ return d.latitude })
      ])
     .range([height - padding, padding])
  }

  function renderQuakesMap(quakes){

    svgMap = d3.select('.container-quakes')
               .append('svg')
               .attr('height', svgHeight)
               .attr('width', svgWidth)
               .attr('class', 'quake-map-canvas')

    var xScale = buildXScale(quakes, svgWidth, scatterPadding)
    var yScale = buildYScale(quakes, svgHeight, scatterPadding)
    var rScale = d3.scale.linear().domain([0, d3.max(quakes, function(d){ return d.size })]).range([0, 10])

    svgMap.selectAll('circle')
          .data(quakes)
          .enter()
          .append('circle')
          .attr('cx', function(d){ return xScale(d.longitude) })
          .attr('cy', function(d){ return yScale(d.latitude) })
          .attr('r', function(d){ return rScale(d.size) })
          .attr('fill', function (d){ return "rgb("+ (d.size * 120) +",0,0)" })

    svgMap.selectAll('text')
          .data(quakes)
          .enter()
          .append('text')
          .text(function(d){ return d.longitude + ", " + d.latitude })
          .attr('x', function(d){ return xScale(d.longitude) })
          .attr('y', function(d){ return yScale(d.latitude) })
          .attr('font-family', 'sans-serif')
          .attr('font-size', '11px')

    svgMap.append('text')
          .text('Earthquake size by latitude & longitude')
          .attr('x', 20)
          .attr('y', 100)
  }

  return { bindEventListeners: bindEventListeners }
})()
