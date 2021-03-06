var map, featureList, earthcacheSearch = [], museumSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);



$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var object = map._layers[id];
  map.setView([object.getLatLng().lat, object.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through earthcachesLayer layer and add only features which are in the map bounds */
  if (map.hasLayer(earthcachesLayer)) {
	earthcachesLayer.eachLayer(function (layer) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="20" height="23" src="assets/img/earthcache.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '<br><span class="feature-subname">Geotop Nummer '+layer.feature.properties.NUMBER+'<br>'+layer.feature.properties.CODE+'</span></td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    });
  }
  /* Loop through geotops layer and add only features which are in the map bounds */
  if (map.hasLayer(geotopsLayer)) {
	geotopsLayer.eachLayer(function (layer) {
      if (map.getBounds().contains(layer.getLatLng())) {
		  
	  var name = "N/A"; // XXX layer.feature.properties.NAME
	  var code = "N/A"; // XXX layer.feature.properties.CODE
	  var number = "N/A"; // XXX layer.feature.properties.NUMBER
		  
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="20" height="23" src="assets/img/geotop.png"></td><td class="feature-name">' + name + '<br><span class="feature-subname">Geotop Nummer '+number+'</span></td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    });
  }
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var D = {};

D.Geotops = {
	
	data : {},
	tags : {},
	
	GetById : function ( id ) {
		// TODO id is not the index - this is a hack!
		var objGeotop = this.data[/*index=*/id-1];
		if ( objGeotop ) {
			if ( objGeotop.id && (objGeotop.id != id) ) {
				alert( "Geotops: id mismatch ("+objGeotop.id+") ("+id+")");
			}
		} else {
			alert (objGeotop );
		}
	
		return objGeotop;		
	},
	
	GetTagsById : function ( id ) {
		var index=0;
		var tags = "";

		for (index = 0; index < this.data.length; ++index) {
			var object = this.tags[index];
			if ( object.geotopId == id ) {
				tags = object.tags;
				break;
			}
		}		
		return tags;
	}
}

D.Earthcaches = {
	
	data : {},
	
	GetById : function ( id ) {
		// TODO id is not the index - this is a hack!
		var objEarthcache = this.data[/*index=*/ id-1];

		if ( objEarthcache ) {
			if ( objEarthcache.id && (objEarthcache.id != id) ) {
				alert( "Earthcaches: id mismatch ("+objEarthcache.id+") ("+id+")");
			}
		} else {
			alert( objEarthcache );
		}
		
		return	objEarthcache;			
		
	},
	
	GetByGeotopId : function ( id ) {
		var objEarthcaches = [];
		var index=0;

		for (index = 0; index < this.data.length; ++index) {
			var objEarthcache = this.data[index];
			if ( objEarthcache.geotopId == id ) {
				objEarthcaches.push(objEarthcache);
			}
		}		

		return objEarthcaches;
	}
}

function loadData( step ) {
	
	console.log( "+loadData( step="+step+" )" );
	switch ( step ) {
		case 0:
			$.getJSON( "data/earthcaches.json", function(data) {
				D.Earthcaches.data = data.features;
				loadData( step+1 );	
			} );
			break;
		case 1: 
			$.getJSON( "data/geotops.json", function(data) {
				D.Geotops.data = data.features;
				loadData( step+1 );	
			} );				
			break;
		case 2: 
			$.getJSON( "data/geotops-tags.json", function(data) {
				D.Geotops.tags = data;
				loadData( step+1 );	
			} );				
			break;
		case 3: 
			loadData( step+1 );				
			break;			
		case 4:
			$.getJSON("data/earthcaches.geojson", function (data) {
				earthcachesLayer.addData(data);
				map.addLayer(earthcachesLayer);

				earthcachesArchivedLayer.addData(data);
				map.addLayer(earthcachesArchivedLayer);

				loadData( step+1 );		
			});		
			break;
		case 5:
			$.getJSON("data/geotops.geojson", function (data) {
				geotopsLayer.addData(data);
				map.addLayer(geotopsLayer);			
				loadData( step+1 );		
			});		
			break;
		case 6:
			$.getJSON("data/bundeslaender_simplify0.geojson", function (data) {
			  borderLayer.addData(data);
			  map.addLayer(borderLayer);		
			  loadData( step+1 );	
			});		
			break;
			
	}
	console.log( "-loadData( step="+step+" )" );	
}


var borderLayer = L.geoJson(null, {
  style: function (feature) {
      return {
        color: "#ff3135",
        weight: 3,
        opacity: 1
      };	  
  }
});


var earthcachesLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
	  
    if (!feature.properties) {
		alert("no feature.properties (earthcache)");
	}  
	
	var objEarthcache = D.Earthcaches.GetById( feature.properties.refId );
	  
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/earthcache.png",
        iconSize: [20, 23],
        iconAnchor: [10, 23],
        popupAnchor: [0, -25]
      }),
      title: objEarthcache.name, 
      riseOnHover: true
    });
  },
  
  filter: function(feature, layer) {
	  var objEarthcache = D.Earthcaches.GetById( feature.properties.refId );
	  return !( objEarthcache.archived && objEarthcache.archived == true );
  },  
  
  onEachFeature: function (feature, layer) {
    
	if (!feature.properties) {
		alert("no feature.properties (earthcache)");
	}  
	
	var objEarthcache = D.Earthcaches.GetById( feature.properties.refId );
	
	var name = objEarthcache.name; 
	var code = objEarthcache.CODE; 
	
	var objGeotop = D.Geotops.GetById( objEarthcache.geotopId );
	  
    var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + name + "</td></tr>" + 
		"<tr><th>Website</th><td><a class='url-break' href='http://coord.info/" + code + "' target='_blank'>http://coord.info/" + code + "</a></td></tr>" +
		"<tr><th>Geotop</th><td>#"+objGeotop.number+"&nbsp;"+objGeotop.name+"</td></tr>" +
		"<tr><th>Website</th><td><a class='url-break' href='http://www.lfu.bayern.de/geologie/geotope_schoensten/" + objGeotop.number + "/index.htm' target='_blank'>Details</a>&nbsp;-&nbsp;<a class='url-break' href='http://www.lfu.bayern.de/geologie/geotope_schoensten/" + objGeotop.number + "/doc/"+ objGeotop.number +"_schautafel.pdf' target='_blank'>Schautafel</a></td></tr>" +		
		"<table>";
    
	layer.on({
        click: function (e) {
          $("#feature-title").html('<img width="20" height="23" src="assets/img/earthcache.png">&nbsp;'+name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
    });
    
	$("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/earthcache.png"></td><td class="feature-name">' + name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
	  
	var searchtokens = D.Geotops.GetTagsById( objEarthcache.geotopId );
	searchtokens = searchtokens+" "+objGeotop.number;
	
    earthcacheSearch.push({
        name: name,
		gccode: code,
		searchtokens : searchtokens,
		geotopname: objGeotop.name,	
		geotopnumber: objGeotop.number,
		icon: "assets/img/earthcache.png",
        source: "earthcache",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    
  }
});


var earthcachesArchivedLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
	  
    if (!feature.properties) {
		alert("no feature.properties (earthcache)");
	}  
	
	var objEarthcache = D.Earthcaches.GetById( feature.properties.refId );
	  
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/earthcache-archived.png",
        iconSize: [20, 23],
        iconAnchor: [10, 23],
        popupAnchor: [0, -25]
      }),
      title: objEarthcache.name, 
      riseOnHover: true
    });
  },
  
  filter: function(feature, layer) {
	  var objEarthcache = D.Earthcaches.GetById( feature.properties.refId );
	  return ( objEarthcache.archived && objEarthcache.archived == true );
  },
  
  onEachFeature: function (feature, layer) {
    
	if (!feature.properties) {
		alert("no feature.properties (earthcache)");
	}  
	
	var objEarthcache = D.Earthcaches.GetById( feature.properties.refId );
	
	var name = objEarthcache.name; 
	var code = objEarthcache.CODE; 
	
	var objGeotop = D.Geotops.GetById( objEarthcache.geotopId );
	  
    var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + name + "</td></tr>" + 
		"<tr><th>Website</th><td><a class='url-break' href='http://coord.info/" + code + "' target='_blank'>http://coord.info/" + code + "</a></td></tr>" +
		"<tr><th>Geotop</th><td>#"+objGeotop.number+"&nbsp;"+objGeotop.name+"</td></tr>" +
		"<tr><th>Website</th><td><a class='url-break' href='http://www.lfu.bayern.de/geologie/geotope_schoensten/" + objGeotop.number + "/index.htm' target='_blank'>Details</a>&nbsp;-&nbsp;<a class='url-break' href='http://www.lfu.bayern.de/geologie/geotope_schoensten/" + objGeotop.number + "/doc/"+ objGeotop.number +"_schautafel.pdf' target='_blank'>Schautafel</a></td></tr>" +		
		"<table>";
    
	layer.on({
        click: function (e) {
          $("#feature-title").html('<img width="20" height="23" src="assets/img/earthcache.png">&nbsp;'+name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
    });
    
	$("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/earthcache.png"></td><td class="feature-name">' + name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
	  
	var searchtokens = D.Geotops.GetTagsById( objEarthcache.geotopId );
	searchtokens = searchtokens+" "+objGeotop.number;
	  
    earthcacheSearch.push({
        name: name,
		gccode: code,
		searchtokens : searchtokens,
		geotopname: objGeotop.name,	
		geotopnumber: objGeotop.number,
		icon: "assets/img/earthcache-archived.png",
        source: "earthcache-archived",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    
  }
});

var iconPinGeotops = {
	
	options : {
		iconUrl: "assets/img/geotop.png",
        iconSize: [20, 23],
        iconAnchor: [10, 23],
        popupAnchor: [0, -25]
	},
	
	getHtmlImgElement : function () {
		return '<img width="'+this.options.iconSize[0]+'" height="'+this.options.iconSize[1]+'" src="'+this.options.iconUrl+'">';
	},
	
	getUrl : function () {
		return this.options.iconUrl;
	}
}

var geotopsLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {

    if (!feature.properties) {
		alert("no feature.properties (geotop)");
	}  
	
	var objGeotop = D.Geotops.GetById( feature.properties.refId );
	
	var name = objGeotop.name;
	var number = objGeotop.number; 	  
	  
    return L.marker(latlng, {
      icon: L.icon( iconPinGeotops.options ),
      title: name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (!feature.properties) {
		alert("no feature.properties (geotop)");
	}
	
	var objGeotop = D.Geotops.GetById( feature.properties.refId );
	
	var name = objGeotop.name;
	var number = objGeotop.number; 
	
	var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + name + "</td></tr>" + "<tr><th>Geotop-Nr</th><td>" + number + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='http://www.lfu.bayern.de/geologie/geotope_schoensten/" + number + "/index.htm' target='_blank'>Details</a>&nbsp;-&nbsp;<a class='url-break' href='http://www.lfu.bayern.de/geologie/geotope_schoensten/" + number + "/doc/"+number+"_schautafel.pdf' target='_blank'>Schautafel</a></td></tr></table>"; 
	
	content = content + "<p>&nbsp;</p><h4 class='typeahead-header'><img src='assets/img/earthcache.png' width='20' height='23'>&nbsp;Earthcaches</h4>";
	
	var index=0;
	var objEarthcaches = D.Earthcaches.GetByGeotopId( feature.properties.refId );
	for (index = 0; index < objEarthcaches.length; ++index) {
		content = content + "<a class='url-break' href='http://coord.info/" + objEarthcaches[index].CODE + "' target='_blank'>"+objEarthcaches[index].name+" ("+objEarthcaches[index].CODE+")</a><br/>";
	}	

	
    layer.on({
        click: function (e) {
          $("#feature-title").html(iconPinGeotops.getHtmlImgElement()+'&nbsp;'+ name );
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
    $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="20" height="23" src="assets/img/geotop.png"></td><td class="feature-name">' + name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    
	var searchtokens = D.Geotops.GetTagsById( feature.properties.refId );
	searchtokens = searchtokens+" "+objGeotop.number;
	
	museumSearch.push({
        name: name,
		geotopname: objGeotop.name,	
		geotopnumber: objGeotop.number,
		icon: "assets/img/geotop.png",
        source: "geotop",
		searchtokens : searchtokens,
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
    });
    
  }
});

geotopsLayer.icon = iconPinGeotops;






map = L.map("map", {
  zoom: 8,
  center: [48.94655556, 11.40447222],
  layers: [mapLayerMapnik, highlight],
  zoomControl: false,
  attributionControl: false
});


map.on("overlayadd", function(e) {
  syncSidebar();
});

map.on("overlayremove", function(e) {
  syncSidebar();
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var groupedOverlays = {
  "Daten": {
    "<img src='assets/img/geotop.png' width='20' height='23'>&nbsp;Geotope": geotopsLayer,
	"<img src='assets/img/earthcache.png' width='20' height='23'>&nbsp;Earthcaches": earthcachesLayer,
	"<img src='assets/img/earthcache-archived.png' width='20' height='23'>&nbsp;Earthcaches archived": earthcachesArchivedLayer
  },
  "Overlays" : {
	"Bayern" : borderLayer  
  },
  "H??hen" : {
	"Schatten": mapLayerHillshadow,
	"Schatten (ASTER)": mapLayerASTERHillshade,
	"Linien (ASTER)": mapLayerASTERContours
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var earthcacheBH = new Bloodhound({
    name: "earthcache",
    datumTokenizer: function (d) {
      var tokens1 = Bloodhound.tokenizers.whitespace(d.name);
	  var tokens2 = Bloodhound.tokenizers.whitespace(d.searchtokens);
	  var tokens3 = Bloodhound.tokenizers.whitespace(d.geotopname);
	  var tokens = tokens1.concat(tokens2).concat(tokens3);
	  return tokens;
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: earthcacheSearch,
    limit: 10
  });

  var museumsBH = new Bloodhound({
    name: "geotops",
    datumTokenizer: function (d) {
      var tokens1 = Bloodhound.tokenizers.whitespace(d.name);
	  var tokens2 = Bloodhound.tokenizers.whitespace(d.searchtokens);
	  var tokens = tokens1.concat(tokens2);
	  return tokens;
    },
    queryTokenizer: function (d) {
		var tokens = Bloodhound.tokenizers.whitespace(d);
		console.log( tokens );
		return tokens;
	},
    local: museumSearch,
    limit: 10
  });

  earthcacheBH.initialize();
  museumsBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 1,
    highlight: true,
    hint: true
  }, {
    name: "earthcache",
    displayKey: "name",
    source: earthcacheBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/earthcache.png' width='20' height='23'>&nbsp;Earthcaches</h4>",
      suggestion: Handlebars.compile(["<img src='{{icon}}' width='20' height='23'>&nbsp;{{name}}&nbsp;({{gccode}})<br><small>&nbsp;Geotop {{geotopnumber}}:&nbsp;{{geotopname}}</small>"].join(""))
    }
  }, {
    name: "geotops",
    displayKey: "name",
    source: museumsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/geotop.png' width='20' height='23'>&nbsp;Geotope</h4>",
      suggestion: Handlebars.compile(["<img src='{{icon}}' width='20' height='23'>&nbsp;{{name}}<br>&nbsp;<small>Geotop {{geotopnumber}}</small>"].join(""))
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "earthcache") {
      if (!map.hasLayer(earthcachesLayer)) {
        map.addLayer(earthcachesLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "geotop") {
      if (!map.hasLayer(geotopsLayer)) {
        map.addLayer(geotopsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

loadData(0);