
const EQUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function init(){
  d3.json(EQUrl).then(function(data) {
    EQdata(data);

  })
}

function radSize(magnitude){
    return magnitude*5;
}

function getColor(depth){
    let color = '#00ff40';
    switch (true){ 
        case depth > 95:
            color = '#ff0000';
            break;
        case depth > 80:
            color = '#ff8000';
            break;
        case depth > 60:
            color = '#ffbf00';
            break;
        case depth > 40:
            color = '#ffff00';
            break;
        case depth > 20:
            color = '#bfff00';
            break;
    }

    return color;
}

function EQdata(data) {
    var markers=[];

    data.features.forEach(function(item) {
        var location = item.properties.place;
        var time = item.properties.time;
        var latLng = [item.geometry.coordinates[1],item.geometry.coordinates[0]];

        var markerData = {
        radius: get_size(item.properties.mag),
        fillColor: get_color(item.geometry.coordinates[2]),
        color: "#000000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6,
        };

        var marker = L.circleMarker(latLng,markerData).bindPopup(`<h2>${location}<br>${new Date(time)}<br>${latLng}</h2>`);
        markers.push(marker);
    });

    createMap(L.layerGroup(markers));
}
  
function createLegend(map) {
    var legend = L.control({position: "bottomright"})
    var labels = []

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            depths = ["20", "40", "60", "80", "90", "95+"],
            colors = ["#00ff40","#bfff00","#ffff00","#ffbf00","#ff8000","#ff0000"];
        
        depths.forEach((element, index) => {
            div.innerHTML += 
            labels.push('<i class="circle" style="background:' + colors[index] + '"></i> ' +
            (element ? element : '+'));
        });

        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map);
}

function createMap(data) {
    const mapURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}';

    var topography = L.tileLayer(mapURL, {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        tileSize: 500,
    });

    var baseMap = {
        "Topographic Map": topography
    };

    var EQMap = {
        Earthquakes: data
    };

    var myMap = L.map("mapid", {
        center: [39, -100],
        zoom: 5,
        layers: [topography, earthquake]
    });

    L.control.layers(baseMap, EQMap, {
        collapsed: false
    }).addTo(myMap);

createLegend(myMap);
}

init();