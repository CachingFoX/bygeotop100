
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#cluster-btn").click(function() {
	if ( $("#cluster-btn-icon").attr('class') == "square-o" ) {
		$("#cluster-btn-icon").attr('class', "fa fa-check");
	} else {
		$("#cluster-btn-icon").attr('class', "square-o");
	}
	markerClusters.clearLayers();
	syncSidebar();
});

