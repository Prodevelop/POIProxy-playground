var loadPhotos = function(mapId) {
    var features = [];

    var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    });
    var map = L.map(mapId || 'map', {
        layers: [baseLayer]
    }).setView([0, 0], 2);
    var markers = new L.MarkerClusterGroup({
        maxClusterRadius: 2
    });
    map.addLayer(markers);
    $('.photos-combo').change(function() {
        loadService($(this).val());
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            loadService('panoramio', position.coords);
        });
    }

    var loadService = function(service, coords) {
        markers.clearLayers();
        var center = map.getCenter();
        var lon = center.lng;
        var lat = center.lat;

        if (coords) {
            lon = coords.longitude;
            lat = coords.latitude;
        }

        if (service) {
            $.ajax({
                url: 'http://app.prodevelop.es/poiproxy/browseByLonLat?&service=' + service + "&lon=" + lon + '&lat=' + lat + '&dist=1000',
                jsonp: "callback",
                dataType: "jsonp",
                error: function() {},
                success: function(response) {
                    var geoJsonLayer = L.geoJson(response.features, {
                        onEachFeature: function(feature, layer) {
                            var popupContent = '';
                            if (feature.properties) {
                                popupContent += "<strong>" + feature.properties.name + "</strong>";
                                popupContent += "</br>";

                                popupContent += "<a href='" + feature.properties.image + "' target='_blank'><img width=200 src='" + feature.properties.image + "'/></a>";
                                layer.bindPopup(popupContent);
                            }
                        }
                    });
                    markers.addLayer(geoJsonLayer);
                }
            });
        }
    }
    loadService('panoramio');
};