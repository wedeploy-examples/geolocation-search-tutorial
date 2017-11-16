var circle;
var markers = [];

function clearPlot() {
	markers.forEach(function(marker) {
		marker.setMap(null);
	});
	markers = [];
}

function plotMarkers(circle, name, geo_location, categories) {
	var latLng = geo_location.split(', ');
	var lat = latLng[0];
	var lng = latLng[1];

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lng),
		map: circle.map,
		title: name
	});

  var markerMap = marker.map;

  createInfoWindow();
  markers.push(marker);
}

function createInfoWindow() {
  var listings = document.querySelectorAll('.list-result-container');

  listings.forEach(function(listing) {
    listing.addEventListener('mouseenter', function(listingItem) {
      var data = listingItem.target.attributes;

      var infoWindowContent = '<div class="marker-container">' +
        '<p class="name">' + data[1].value + '</p>' +
        '<p class="categories"><em>Categories:</em><br>' + data[2].value + '</p>' +
        '</div';

      latLng = data[3].value.split(', ');
      var lat = latLng[0];
      var lng = latLng[1];

      var infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 260,
        position: new google.maps.LatLng(lat, lng),
        pixelOffset: new google.maps.Size(0,-28)
      });

      infoWindow.open(circle.map);

      listing.addEventListener('mouseleave', function() {
        infoWindow.close();
      });
    });

  });
}

function debounce(fn, delay) {
	var id;
	return function() {
		var args = arguments;
		clearTimeout(id);
		id = setTimeout(function() {
			fn.apply(this, args);
		}, delay);
	};
}

google.maps.event.addDomListener(window, 'load', function() {
	var center = {
		lat: 41.4993,
		lng: -81.6944
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: center,
		zoom: 14,
		mapTypeControl: false,
		fullscreenControl: false,
		streetViewControl: false
	});

	circle = new google.maps.Circle({
		fillColor: '#FF0000',
		fillOpacity: 0.1,
		map: map,
		strokeColor: '#FF0000',
		strokeOpacity: 0.5,
		strokeWeight: 1.5,
		center: center,
		draggable: true,
		editable: true,
		radius: 1400
	});

	var reloadVenuesDebounced = debounce(reloadVenues.bind(null, circle), 200);
	google.maps.event.addListener(circle, 'radius_changed', reloadVenuesDebounced);
	google.maps.event.addListener(circle, 'center_changed', reloadVenuesDebounced);
	reloadVenues(circle);
});
