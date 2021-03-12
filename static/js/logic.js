// Constructing my url to pull the JSON
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//Making a function to fill my cricles according to quake depth
function getColor(d) {
  return d > 100 ?'#D53E4F' :
        d > 80  ?'#FC8D59' :
        d > 60  ?'#FEE08B' :
        d > 40  ?'#E6F598' :
        d > 20   ?'#99D594' :
                  '#3288BD';
};

//Pulling in the JSON from the USGS site
d3.json(queryUrl, function(data) {
  //Putting my response into the create bubbles feature.
  createFeatures(data.features);
  console.log(data.features);
});

function createFeatures(quakes) {
  //Creating a function to make the circles for each feature
  function onEachFeature (feature, layer) {
    L.circle(
      [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "white",
        fillColor: getColor(feature.geometry.coordinates[2]),
        radius: feature.properties.mag * 3
      }).bindPopup("<h3>" + feature.properties.title +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  let earthquakes = L.geoJSON(quakes, {
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
};

function createMap(earthquakes) {

  //making my base lightmap
  let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v9",
    accessToken: API_KEY
  });

  let baseMaps = {
    "Light Map": lightmap
  }

  let overlayMaps = {
    Earthquakes: earthquakes
  }

  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 20, 40, 60, 80, 100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

  legend.addTo(myMap);
};
