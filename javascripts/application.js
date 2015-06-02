var svg;
var svgHeight = 200;
var svgWidth = 500;
var barPadding = 1;
(function(){
  var quakesURL = "http://apis.is/earthquake/is";
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
  return quakeResults.results
}

function renderQuakes(quakes){

   function getRealQuakes(quake){
    return quake.size > 0;
  }

  var realQuakes = quakes.filter(getRealQuakes)

  // quakes.forEach(function(index, quake){
    d3.select('.quake-events').selectAll('div')
      .data(realQuakes)
      .enter()
      .append('div')
      .attr('class', 'bar')
      // .text(function(d){
      //   return d.size
      // })
      .style("background-color", function(d){
        // if (d.size <= 0.5){
        //   return "grey";
        // } else if (d.size <= 0.75) {
        //   return "lightgreen";
        // } else if (d.size <= 1){
        //   return "green";
        // } else if (d.size <= 1.25){
        //   return "blue";
        // } else if (d.size > 1.25){
          return "red";
        // }
      })
      .attr("opacity", function(d){
        return d.size;
      })
      //   if (d.size <= 0.5){
      //     return 0.1;
      //   } else if (d.size <= 0.75) {
      //     return 0.3;
      //   } else if (d.size <= 1){
      //     return 0.5;
      //   } else if (d.size <= 1.25){
      //     return 0.75;
      //   } else if (d.size > 1.25){
      //     return 0.95;
      //   }
      // })
      .style('height', function(d){
        return (d.size * 100) + 'px';
      })
      .style('width', '15px');
  // })
  // function createSVGCanvas(){
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
          return svgHeight - d.size * 100;
        })
        .attr('height', function(d){
          return d.size * 100;
        })
        .attr('width', svgWidth / realQuakes.length - barPadding)
        .attr('fill', function(d){
          return "rgb(0,"+ (d.size * 100) +",0)";
        });
        //   function(d, i){
        //   return i * (svgWidth / realQuakes.length - barPadding);
        // });
  // }
}
