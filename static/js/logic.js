// Constructing my url to pull the JSON
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

//Pulling in the JSON from the USGS site
d3.json(queryUrl, function(data) {
  //Putting my response into the create bubbles feature.
  createBubbles(data.features);
  console.log(data.features);
});

