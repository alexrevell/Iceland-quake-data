
(function(){
  var baseURI = "http://apis.is/";
  var getQuakesURI = "earthquake/is";
  d3.json("http://apis.is/earthquake/is", renderQuakes)
})();

function renderQuakes(quakeResults){
  // quakeResults.forEach(function(index, quake){
    console.log(quakeResults);
}