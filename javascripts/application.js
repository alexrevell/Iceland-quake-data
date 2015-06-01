var svg;
(function(){
  var quakesURL = "http://apis.is/earthquake/is";
  createSVGCanvas();
  getAndExtractQuakesEventHandler(quakesURL, getQuakes, extractQuakes, renderQuakes);

})();

function getAndExtractQuakesEventHandler(url, getQuakes, extractQuakes, renderQuakes){
  getQuakes(url, function(data){
    var quakes = extractQuakes(data);
    renderQuakes(quakes)
  })
}

function getQuakes(url, callback){
  d3.json(url, callback);
}

function extractQuakes(quakeResults){
  console.log(quakeResults.results)
  return quakeResults.results
}

function renderQuakes(quakes){
  // quakes.forEach(function(index, quake){
    d3.select('.quake-events').selectAll('div')
      .data(quakes)
      .enter()
      .append('div')
      .attr('class', 'bar')
      // .text(function(d){
      //   return d.size
      // })
      .style("background-color", function(d){
        if (d.size <= 0.5){
          return "grey";
        } else if (d.size <= 0.75) {
          return "lightgreen";
        } else if (d.size <= 1){
          return "green";
        } else if (d.size <= 1.25){
          return "blue";
        } else if (d.size > 1.25){
          return "red";
        }
      })
      .style('height', function(d){
        return (d.size * 100) + 'px';
      })
      .style('width', '20px');
  // })
}

function createSVGCanvas(){
  svg = d3.select('.quake-events').append('svg').attr('class', 'quake-canvas')
}