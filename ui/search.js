function reloadVenues(searchArea) {
	var lat = searchArea.center.lat();
	var lng = searchArea.center.lng();
	var radius = parseInt(searchArea.radius, 10);
	var queryStr = document.getElementById('query').value;

	WeDeploy
		.data('https://db-geodemo.wedeploy.io')
		.prefix('name', queryStr)
		.limit(100)
		.aggregate('score')
		.distance('location', lat + ', ' + lng, radius + 'm')
		.highlight('name')
		.search('places')
		.then(function(results) {
			plotResults(results);
		})
}

// Private helpers -------------------------------------------------------------

function plotResults(results) {
	clearPlot();

  var resultCanvas = document.getElementById('result-canvas');
  var resultTime = document.getElementById('result-time');
  var resultItems = document.getElementById('results');

  if (results.documents) {
    var resultList = '';
    var resultTimeResponse = results.documents.length + ' results found in ' + results.queryTime + 'ms.';
    resultTime.innerHTML = resultTimeResponse;
    resultCanvas.style.display = "inline";

		results.documents.forEach(function(place) {
			var categoryString = place.categories.toString().replace(/,/g, ', ');

			resultList +=
        '<div class="list-result-container" data-name="' + place.name + '" data-categories="' + categoryString + '" data-location="' + place.location + '">' +
				'<p class="name">' + results.highlights[place.id].name[0] + '</p>' +
				'<p class="address">' + place.address + '<br>'
				+ place.city + ', ' + place.state + ' ' + place.postal_code + '</p>' +
				'</div>';

			resultItems.innerHTML = resultList;
      plotMarkers(circle, place.name, place.location, categoryString);
      createInfoWindow();
		});

	} else {
    resultCanvas.style.display = "none";
		resultItems.innerHTML = '';
    resultTime.innerHTML = '';
	}
}

function initialize() {
	document.getElementById('query').oninput = function(e) {
		if (circle) {
			reloadVenues(circle);
		}
	};
}

window.onload = initialize;
