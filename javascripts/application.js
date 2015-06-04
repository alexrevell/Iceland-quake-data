var pusher = new Pusher('fd6aa7a99cd60a7f3510');
var svg;
var svgHeight = 300;
var svgWidth = 500;
var barPadding = 1;
var scatterPadding = 20;
(function(){
  var quakesURL = "http://apis.is/earthquake/is";
  getAndExtractQuakesEventHandler(quakesURL, getQuakes, extractQuakes, renderQuakes);

})();

function getAndExtractQuakesEventHandler(url, getQuakes, extractQuakes, renderQuakes){
  getQuakes(url, function(data){
    var quakes = extractQuakes(data);
    console.log(quakes)
    renderQuakes(quakes)
  })
}

function getQuakes(url, callback){
  d3.json(url, callback);
}

function extractQuakes(quakeResults){
  return quakeResults.results
}

function renderQuakes(quakes){

   function getRealQuakes(quake){
    return quake.size > 0;
  }

  var realQuakes = quakes.filter(getRealQuakes)

    d3.select('.quake-events').selectAll('div')
      .data(realQuakes)
      .enter()
      .append('div')
      .attr('class', 'bar')
      .style("background-color","red")
      .style('height', function(d){
        return (d.size * 100) + 'px';
      })
      .style('width', '15px');

    svg = d3.select('body')
            .append('svg')
            .attr('height', svgHeight)
            .attr('width', svgWidth)
            .attr('class', 'quake-canvas');

    svg.selectAll('rect')
        .data(realQuakes)
        .enter()
        .append('rect')
        .attr('x', function(d, i){
          return i * svgWidth / realQuakes.length;
        })
        .attr('y', function(d){
          return svgHeight - d.size * 80;
        })
        .attr('height', function(d){
          return d.size * 80;
        })
        .attr('width', svgWidth / realQuakes.length - barPadding)
        .attr('fill', function(d){
          return "rgb("+ (d.size * 120) +",0,0)";
        });

    svg.selectAll('text')
        .data(realQuakes)
        .enter()
        .append('text')
        .text(function(d, i){
          return d.size;
        })
        .attr('x', function(d, i){
          return i * (svgWidth / realQuakes.length) + (svgWidth / realQuakes.length - barPadding) / 2;
        })
        .attr('y', function(d, i){
          return svgHeight - d.size * 80 + 10;
        })
        .attr('text-anchor', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10px')
        .attr('fill', 'white');

    svg.append('text')
        .text('Earthquakes by size over last 48 hours')
        .attr('x', 20)
        .attr('y', 100);

    var svgMap = d3.select('body')
            .append('svg')
            .attr('height', svgHeight)
            .attr('width', svgWidth)
            .attr('class', 'quake-map-canvas');

    var xScale = d3.scale.linear()
                  .domain([d3.min(realQuakes, function(d){return d.longitude;}), d3.max(realQuakes, function(d){return d.longitude;})])
                  .range([scatterPadding, svgWidth - scatterPadding]);

    var yScale = d3.scale.linear()
                  .domain([d3.min(realQuakes, function(d){return d.latitude;}), d3.max(realQuakes, function(d){return d.latitude;})])
                  .range([svgHeight - scatterPadding, scatterPadding]);

    svgMap.selectAll('circle')
            .data(realQuakes)
            .enter()
            .append('circle')
            .attr('cx', function(d){
              return xScale(d.longitude);
            })
            .attr('cy', function(d){
              return yScale(d.latitude);
            })
            .attr('r', function(d){
              return d.size * 10;
            });

    svgMap.selectAll('text')
            .data(realQuakes)
            .enter()
            .append('text')
            .text(function(d){
              return d.longitude + ", " + d.latitude;
            })
            .attr('x', function(d){
              return xScale(d.longitude);
            })
            .attr('y', function(d){
              return yScale(d.latitude);
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', '11px')
            .attr('fill', 'red');

}
