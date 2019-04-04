let grayScaleMap = L.map("mapDiv").setView([32.18, -99.14], 4);
var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});
Esri_WorldGrayCanvas.addTo(grayScaleMap);

let stateDemographicsUrl = 'https://geog4046.github.io/portfolio/data/us_state_demographics_ESRI_2010A.geojson'

jQuery.getJSON(stateDemographicsUrl, function (data) {
    let sumMales = 0;
    let sumFemales = 0;
    for (var i = 0; i < data.features.length; i++) {
        sumMales += data.features[i].properties.MALES;
        sumFemales += data.features[i].properties.FEMALES;
    }
    let nationalRatio = (sumMales / sumFemales).toFixed(5);

    function getColor(d) {
        return d > .05 ? '#e86666' :
            d > .025 ? '#ef8d8d' :
            d > 0 ? '#f4b7b7' :
            d > -.025 ? '#afe1f7' :
            d > -.05 ? '#85c8e5' :
                        '#68adc9';
    }

    let stateStyle = function (feature) {
        let ratio = feature.properties.MALES / feature.properties.FEMALES;
        let difference = 1 - ratio;
        stateColor = getColor(difference);
        return {
            color: 'black', //use the color variable above for the value
            weight: 2,
            fillOpacity: 0.2,
            fillColor: stateColor
        }
    }
    
    let onEachFeature = function (feature, layer) {
        let name = feature.properties.STATE_NAME
        let stateRatio = (feature.properties.MALES / feature.properties.FEMALES).toFixed(5);
        layer.bindPopup('Ratio of Males to Females for ' + name + ': ' + stateRatio + '\r\nNational Ratio: ' + nationalRatio);
    }
    let stateGeojsonOptions = { 
        style: stateStyle,
        onEachFeature: onEachFeature
    }
    L.geoJSON(data, stateGeojsonOptions).addTo(grayScaleMap);
});


