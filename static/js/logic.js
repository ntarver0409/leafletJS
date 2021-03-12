// Constructing my url to pull the JSON
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//Making a function to fill my cricles according to quake depth


let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v9",
    accessToken: API_KEY
  });

  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap]
  });

//Pulling in the JSON from the USGS site
d3.json(queryUrl, function(data) {
  function styleInfo(feature){
    return {fillOpacity: 0.75,
            color: "white",
            weight: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: feature.properties.mag * 4};
  };
  function getColor(d) {
    return d > 100 ?'#D53E4F' :
          d > 80  ?'#FC8D59' :
          d > 60  ?'#FEE08B' :
          d > 40  ?'#E6F598' :
          d > 20   ?'#99D594' :
                    '#3288BD';}

  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);},
    style: styleInfo, 
    onEachFeature: function onEachFeature (feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.title +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + "Depth: "
        + feature.geometry.coordinates[2] + " km" + "</p>");
    }
  }).addTo(myMap);

  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function() {

    const div = L.DomUtil.create('div', 'info legend');
    const depths = [0, 20, 40, 60, 80, 100];
    let labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

  legend.addTo(myMap);
});




