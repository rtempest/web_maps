
// function to populate the dropdown with each unique species
const populateDropdown = () => {
    let dropdown = document.getElementById('dropdown');
    // for each feature in json
    var species = [];
    trees.features.forEach(function (item) {
        common_name = item.properties.common_name
        if (species.includes(common_name)) {
        } else {
            species.push(common_name);
        }
        species.sort();
    })
    // add the species to the dropdown
    species.forEach(function (item) {
        dropdown.innerHTML += `<option value="${item}">${item}</option>`;
    })

}

//  populate dropdown
populateDropdown();

// initiate map and set the view
var map = L.map('map').setView([49.282, -123.122], 15);

// add the basemap
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);


var layer; //initiate layer

// highlight the feature e - for mouse over
function highlightFeature(e) {
    // set variable for the feature to highlight
    layer = e.target;
    // style the feature
    layer.setStyle({
        weight: 5,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });
}
// reset the feature back to normal - for mouse out
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

// create popup
function popup(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
    var popupContent = `<h2 class='popup-h2'>${feature.properties['common_name']}</h2>\
<p><em>${feature.properties['genus_name'].toLowerCase()} ${feature.properties['species_name'].toLowerCase()}</em></p>`;
    layer.bindPopup(popupContent, { maxHeight: 400, maxWidth: 600 });
}

// initiate style
function style(feature) {
    return {
        radius: 4,
        fillColor: "#71A686"
    }
}
// change style when converting to circle
var geojsonMarkerOptions = {
    radius: 4,
    fillColor: "#71A686",
    color: "#333",
    weight: 0.2,
    opacity: 1,
    fillOpacity: 0.8
};

var geojson;

// create the data 
function createData(data) {
    geojson = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions)
        },
        style: style,
        onEachFeature: popup
    })
    return geojson;
}

// add the trees data to the map
geojson = createData(trees);
geojson.addTo(map);


const filterTrees = () => {
    // remove current trees layer and recreate from all trees
    map.removeLayer(geojson);
    geojson = createData(trees);

    // create the filtered trees layer based on the dropdown value
    var filtered_trees = [];
    var filtered_json = JSON.parse(JSON.stringify(trees));
    var value = document.getElementById("dropdown").value;
    for (tree of trees.features) {
        common_name = tree.properties.common_name
        if (value == common_name) {
            filtered_trees.push(tree);
        }
    }
    // update the filtered object's features
    filtered_json.features = filtered_trees;
    geojson = createData(filtered_json);

    // add to map and refresh view
    geojson.addTo(map);
    map.setView([49.282, -123.122], 15)

};

document.addEventListener("change", filterTrees)
