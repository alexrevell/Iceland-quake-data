IcelandQuakes = (function(){
  var svg
  var svgHeight = 300
  var svgWidth = 500
  var barPadding = 1
  var scatterPadding = 20
  var quakesURL = "http://apis.is/earthquake/is";
  var updateQuakesButton

  var bindEventListeners = function () {
    updateQuakesButton = d3.select('.update-quakes')
    updateQuakesButton.on('click', function() {
      getQuakesJson(quakesURL)
      .then(function(response) {
        console.log("response", response)
      })
    })
  }
    // var promise = new Promise(function(resolve, reject) {
    //   resolve(getQuakesJson(quakesURL))
    // });

  // promise.then(function(){console.log("got some stuff")})

    // console.log(updateQuakesButton)
    // updateQuakesButton.submit(function(){console.log("submitted for more quakes!")})
    // getAndExtractQuakesEventHandler(quakesURL, getQuakes, extractQuakes, renderQuakes)
    // pullQuakes(quakesURL).then(function(result){ console.log("Got quakes bro!", result)}, function(err){console.log("stink buzz bro!", err)})
    // getQuakesJson(quakesURL)
  // })();

  function getAndExtractQuakesEventHandler(url, getQuakes, extractQuakes, renderQuakes){
    getQuakes(url, function(data){
      var quakes = extractQuakes(data)
      realQuakes = quakes.filter(getRealQuakes)
      renderQuakes(realQuakes)
    })
  }

  function getQuakesJson(url) {
    // d3.json(url)

    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest()
      request.open('GET', url)

      request.onload = function() {
        if (request.status === 200) {
          resolve(request.response)
        }
        else {
          reject(Error("Quake data didn't load successfully; error code:" + request.statusText));
        }
      }

      request.onerror = function() {
        reject(Error("Something erroreed like the network."))
      }

      request.send()
    })
  }


  // setInterval(function() { getQuakesJson(quakesURL), 2000})

  function getQuakes(url, callback){
    d3.json(url, callback)
  }

  function extractQuakes(quakeResults){
    return quakeResults.results
  }

  function getRealQuakes(quake){
    return quake.size >= 0
  }

  function renderQuakes(quakes){

      d3.select('.quake-events').selectAll('div')
        .data(quakes)
        .enter()
        .append('div')
        .attr('class', 'bar')
        .style("background-color","red")
        .style('height', function(d){
          return (d.size * 30) + 'px';
        })
        .style('width', '10px');

      svg = d3.select('.container-quakes')
              .append('svg')
              .attr('height', svgHeight)
              .attr('width', svgWidth)
              .attr('class', 'quake-canvas');

      svg.selectAll('rect')
          .data(quakes)
          .enter()
          .append('rect')
          .attr('x', function(d, i){
            return i * svgWidth / quakes.length;
          })
          .attr('y', function(d){
            return svgHeight - d.size * 80;
          })
          .attr('height', function(d){
            return d.size * 80;
          })
          .attr('width', svgWidth / quakes.length - barPadding)
          .attr('fill', function(d){
            return "rgb("+ (d.size * 120) +",0,0)";
          });

      svg.selectAll('text')
         .data(quakes)
         .enter()
         .append('text')
         .text(function(d, i){
            return d.size;
          })
         .attr('x', function(d, i){
            return i * (svgWidth / quakes.length) + (svgWidth / quakes.length - barPadding) / 2;
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

      var svgMap = d3.select('.container-quakes')
                     .append('svg')
                     .attr('height', svgHeight)
                     .attr('width', svgWidth)
                     .attr('class', 'quake-map-canvas');

      var xScale = d3.scale.linear()
                     .domain([d3.min(quakes, function(d){
                        return d.longitude;
                      }), d3.max(quakes, function(d){
                        return d.longitude;
                      })])
                     .range([scatterPadding, svgWidth - scatterPadding * 4]);

      var yScale = d3.scale.linear()
                     .domain([d3.min(quakes, function(d){
                        return d.latitude;
                      }), d3.max(quakes, function(d){
                        return d.latitude;
                      })])
                     .range([svgHeight - scatterPadding, scatterPadding]);

      var rScale = d3.scale.linear()
                     .domain([0, d3.max(quakes, function(d){
                        return d.size;
                      })])
                     .range([0, 10]);

      svgMap.selectAll('circle')
            .data(quakes)
            .enter()
            .append('circle')
            .attr('cx', function(d){
              return xScale(d.longitude);
            })
            .attr('cy', function(d){
              return yScale(d.latitude);
            })
            .attr('r', function(d){
              return rScale(d.size);
            });

      svgMap.selectAll('text')
            .data(quakes)
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

      svgMap.append('text')
            .text('Earthquake latitude & longitude with size')
            .attr('x', 20)
            .attr('y', 100);
  }

  return { bindEventListeners: bindEventListeners }
})()
