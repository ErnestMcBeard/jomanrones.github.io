let map = L.map("mapDiv").setView([30.45, -91.18], 10);
L.esri.basemapLayer('Streets').addTo(map);

var fireStations = L.esri.featureLayer({
    url: 'https://services9.arcgis.com/SDQDNhpG8jikA0D1/arcgis/rest/services/Fire_Stations/FeatureServer/0',
    pointToLayer: function (geojson, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: './fire-station.png',
                iconSize: [31, 27],
                iconAnchor: [17.5, 13.5],
                popupAnchor: [0, -11]
            })
        });
    }
}).addTo(map);

var fireIncidents = L.esri.featureLayer({
    url: 'https://services9.arcgis.com/SDQDNhpG8jikA0D1/arcgis/rest/services/2017_2018_Fire_Incidents/FeatureServer/0'
}).addTo(map);
  