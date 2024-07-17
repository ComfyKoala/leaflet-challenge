// Dataset is All M2.5+ Earthquakes within Past 7 days
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson

// Define helper functions
function markerSize(magnitude) {
  return magnitude * 30000;
}

function markerColor(depth) {
  return depth > 90
    ? "#ff4d4d"
    : depth > 70
    ? "#ff794d"
    : depth > 50
    ? "#ffa64d"
    : depth > 30
    ? "#ffff4d"
    : depth > 10
    ? "#d2ff4d"
    : "#4dff4d";
}

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
).then((data) => {
  // store each "feature" or "earthquake event"
  let features = data.features;
  // keep track of markers
  let earthquakes = [];

  // loop thru all features and add as circles
  features.forEach((feature) => {
    let coordinates = [
      // in GeoJSON, we receive long, lat. Leaflet.circle takes lat, long.
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0],
    ];
    let magnitude = feature.properties.mag;
    let date = new Date(feature.properties.time).toLocaleDateString("en-US");
    let circle = L.circle(coordinates, {
      fillOpacity: 0.75,
      color: markerColor(feature.geometry.coordinates[2]),
      radius: markerSize(magnitude),
    }).bindPopup(
      `<h2>Magnitude ${magnitude} </h2> <hr> <h3> ${feature.properties.place} on ${date}</h3>`
    );

    earthquakes.push(circle);
  });

  // set up earthquakeLayer to add to map
  let earthquakeLayer = L.layerGroup(earthquakes);

  // set up street layer to add to map
  let street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  // create map with street and earthquakes
  let myMap = L.map("map", {
    center: [40.75, -105],
    zoom: 5,
    layers: [street, earthquakeLayer],
  });

  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [-10, 10, 30, 50, 70, 90];
    let labels = [];

    div.innerHTML = "";

    limits.forEach(function (limit, index) {
      labels.push(
        `<li style="background-color: ${colors[index]}>${limits[index]}</li>`
      );
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  legend.addTo(myMap);
});
