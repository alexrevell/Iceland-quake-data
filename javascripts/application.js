
(function(){
  var quakesURL = "http://apis.is/earthquake/is";
  getAndExtractQuakesEventHandler(quakesURL, getQuakes, extractQuakes, renderQuakes)

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
    d3.select('.quake-events').selectAll('p')
      .data(quakes)
      .enter()
      .append('p')
      .text(function(d){return d});
  // })
}
