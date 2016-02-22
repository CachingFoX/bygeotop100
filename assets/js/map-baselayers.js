
/* Basemap Layers */
var mapquestOSM = L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"]
}), L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);
var mapLayerMapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18,
	subdomains: ["a","b","c"],
	attribution: 'Kartendaten: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
});		
var mapLayerOpenTopo = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 18,
	subdomains: ["a","b","c"],
	attribution: 'Kartendaten: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, <a href="http://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
var mapLayerHillshadow = L.tileLayer('http://{s}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png', {
	maxZoom: 17,
	subdomains: ["a","b","c"],
	attribution: 'hillshadow \u00a9 <a href="http://a.tiles.wmflabs.org/" target=\'_blank\'>a.tiles.wmflabs.org</a>'
});	
var mapLayerASTERHillshade = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/asterh/x={x}&y={y}&z={z}', {
	maxZoom: 19,
	attribution: 'todo'
});	
var mapLayerASTERContours = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/asterc/x={x}&y={y}&z={z}', {
	maxZoom: 19,
	attribution: 'todo'
});
var mapLayerStamenTonerLite = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
	maxZoom: 19,
	subdomains: ["a","b","c"],
	attribution: 'todo'
});
var mapLayerStamenToner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
	maxZoom: 19,
	subdomains: ["a","b","c"],
	attribution: 'todo'
});
var mapLayerWmfLabsBwMapnik = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 19,
	subdomains: ["a","b","c"],
	attribution: 'hillshadow \u00a9 <a href="http://a.tiles.wmflabs.org/" target=\'_blank\'>a.tiles.wmflabs.org</a>'
});	


var baseLayers = {
  "OSM Mapnik": mapLayerMapnik,
  "OpenTopoMap": mapLayerOpenTopo, 
  "Stamen Toner": mapLayerStamenToner,
  "Stamen Toner-Lite": mapLayerStamenTonerLite,
  "OSM Mapnik BW": mapLayerWmfLabsBwMapnik,
  "Street Map": mapquestOSM,
  "Aerial Imagery": mapquestOAM,
  "Imagery with Streets": mapquestHYB
};