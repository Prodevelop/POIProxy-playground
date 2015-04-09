var features = [];
$(document).ready(function() {
    var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    });
    var map = L.map('map', {
        layers: [baseLayer]
    }).setView([0, 0], 2);
    var markers = new L.MarkerClusterGroup({
        maxClusterRadius: 2
    });
    map.addLayer(markers);
    $('.news-combo').change(function() {
        loadNews($(this).val());
    });
    $('.service-combo').change(function() {
        loadService($(this).val());
    });
    var loadNews = function(channel) {
        markers.clearLayers();
        if (channel) {
            $.ajax({
                url: 'http://app.prodevelop.es/poiproxy/browse?z=0&y=0&x=0&service=' + channel,
                jsonp: "callback",
                dataType: "jsonp",
                error: function() {},
                success: function(response) {
                    var geoJsonLayer = L.geoJson(response.features, {
                        onEachFeature: function(feature, layer) {
                            if (feature.properties) {
                                var popupContent = feature.properties.published;
                                popupContent += "</br>";
                                popupContent += "<strong>" + feature.properties.name + "</strong>";
                                popupContent += "</br>";
                                if (feature.properties.description) {
                                    popupContent += feature.properties.description;
                                    popupContent += "</br>";
                                }

                                popupContent += "<a href='" + feature.properties.web + "' target='_blank'>Open full article</a>";
                                layer.bindPopup(popupContent);
                            }
                        }
                    });
                    markers.addLayer(geoJsonLayer);
                }
            });
        }
    }
    loadNews('cnn');


    var loadService = function(service) {
        markers.clearLayers();
        var center = map.getCenter();
        var lon = center.lng;
        var lat = center.lat;
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
});