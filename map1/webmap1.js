let myMap = L.map("mapDiv").setView([32.18, -99.14], 4);
var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});
Stamen_Watercolor.addTo(myMap);

let marker = L.marker([30, -90]).addTo(myMap);
let polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
  ], {color: 'red'}).addTo(myMap);
  let polyline = L.polyline([
      [30, -91],
      [31, -91],
      [34, -95]
  ], {color: "orange"}).addTo(myMap);

polygon.bindPopup("A polygon");
marker.bindPopup("A marker");
polyline.bindPopup("A polyline");



