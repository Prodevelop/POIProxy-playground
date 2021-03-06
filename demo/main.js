var features = [];
$(document).ready(function() {
    $.ajax({
        url: "config.json",
        type: "GET",
        dataType: 'json',
        success: function(data) {
            load(data);

        },
        error: function(err) {
            load(err);
        }
    });

    var load = function(config) {
        var url = config.url || 'http://app.prodevelop.es/poiproxy';

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
                    'url': url + '/browse?z=0&y=0&x=0&service=' + channel,
                    jsonp: "callback",
                    dataType: "jsonp",
                    error: function() {},
                    success: function(response) {
                        var features = [];
                      	for (var i = 0, l = response.features.length; i<l; i++) {
                            if (response.features[i].geometry.coordinates[0] != 0) {
                                features.push(response.features[i]);
                            }
                        }
                        var geoJsonLayer = L.geoJson(features, {
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
        };
        var loadService = function(service) {
            markers.clearLayers();
            var center = map.getCenter();
            var lon = center.lng;
            var lat = center.lat;
            if (service) {
                $.ajax({
                    'url': url + '/browseByLonLat?&service=' + service + "&lon=" + lon + '&lat=' + lat + '&dist=1000',
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
        loadNews('cnn');
    };
});
