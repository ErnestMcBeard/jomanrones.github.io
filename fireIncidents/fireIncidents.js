let map = L.map("mapDiv").setView([30.45, -91.18], 10);
L.esri.basemapLayer('Streets').addTo(map);

var fireStations = L.esri.featureLayer({
    url: 'https://services9.arcgis.com/SDQDNhpG8jikA0D1/arcgis/rest/services/Fire_Stations/FeatureServer/0',
    pointToLayer: function (geojson, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: './fire-station.png',
                iconSize: [20, 20],
                iconAnchor: [0, 0],
                popupAnchor: [0, -10]
            })
        });
    }
}).addTo(map);

fireStations.bindPopup(function (layer) {
    return L.Util.template('<h5>Fire Station</h5><p>Description: {DESCRIPTION}<br>Agency: {AGENCY}<br>Address: {FULL_ADDRESS}</p>', layer.feature.properties);
});

var fireIncidents = L.esri.featureLayer({
    url: 'https://services9.arcgis.com/SDQDNhpG8jikA0D1/arcgis/rest/services/2017_2018_Fire_Incidents/FeatureServer/0',
    pointToLayer: function (geojson, latlng) {

        // Make icon sizes be relative to amount of lost property
        var iconSize = [10, 10];
        var totalLoss = geojson.properties.CONTENTS_LOSS + geojson.properties.PROPERTY_LOSS;
        if (totalLoss > 2250000) {
            iconSize = [40, 40];
        } else if (totalLoss > 1700000) {
            iconSize = [30, 30];
        } else if (totalLoss > 1100000) {
            iconSize = [20, 20];
        }

        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: './fire.png', 
                iconSize: iconSize,
                iconAnchor: [0, 0],
                popupAnchor: [0, -10]
            })
        });
    }
});
fireIncidents.addTo(map);

var heatMap = L.esri.Heat.featureLayer({
    url: 'https://services9.arcgis.com/SDQDNhpG8jikA0D1/arcgis/rest/services/2017_2018_Fire_Incidents/FeatureServer/0',
    radius: 50
});

fireIncidents.bindPopup(function (layer) {
    var totalLoss = layer.feature.properties.CONTENTS_LOSS + layer.feature.properties.PROPERTY_LOSS;

    return L.Util.template('<h5>Fire Incident: {FORMATTED_STREET}</h5><p>Date:' + getDate(layer.feature.properties["DISPATCH_DATE"]) + '<br>Description: {INCIDENT_DESCRIPTION}<br>Fatalities: {CIVILIAN_FATALITY}<br>Injuries: {CIVILIAN_INJURY}<br>Cause of Ignition: {CAUSE_OF_IGNITION_DESCRIPTION}<br>Total Loss: ' + totalLoss + '</p>', layer.feature.properties);
});

fireIncidents.query().bounds(function (error, latlngbounds) {
    map.fitBounds(latlngbounds);
});

fireIncidents.on('load', iterateFeatures);
function iterateFeatures() {
    fireIncidents.eachFeature(function (layer) {
        layer.feature.properties.DISPATCH_DATE = new Date(layer.feature.properties.DISPATCH_DATE);
        layer.feature.properties.year = layer.feature.properties.DISPATCH_DATE.getFullYear().toString();
        fireIncidents.updateFeature(layer.feature);
    });
}

var selectedYear = document.getElementById('year');
selectedYear.addEventListener('change', function() {
    var copy = fireIncidents;
    fireIncidents.setWhere("year='2017'");
});

var heatMapCheckBox = document.getElementById('heat');
heatMapCheckBox.addEventListener('change', function() {
    if (heatMapCheckBox.checked == true) {
        if (map.hasLayer(fireIncidents)) {
            fireIncidents.remove();
        }
        heatMap.addTo(map);
    } else {
        if (map.hasLayer(heatMap)) {
            heatMap.remove();
        }
        fireIncidents.addTo(map);
    }
})

function getDate(date) {
    if (date != null) {
        return new Date(date).toDateString();
    }
}
