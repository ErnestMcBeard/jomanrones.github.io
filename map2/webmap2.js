let myMap = L.map("mapDiv").setView([32.18, -99.14], 4);
var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
OpenStreetMap_DE.addTo(myMap);

// Radar Data
L.esri.dynamicMapLayer({
    url: 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer',
    transparent: true
}).addTo(myMap);

// Lightning Strikes
L.esri.dynamicMapLayer({
    url: 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/sat_meteo_emulated_imagery_lightningstrikedensity_goes_time/MapServer',
    transparent: true
}).bringToFront().addTo(myMap);