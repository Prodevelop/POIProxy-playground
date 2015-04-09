var demoTemplate = '<div class="container"><div class="row demo-template"></div></div>';
$('#poiproxy-news').click(function() {
    loadMap('#poiproxy-news', 'poiproxy-news-map', loadNewsPlugin);
});

$('#poiproxy-photos').click(function() {
    loadMap('#poiproxy-photos', 'poiproxy-photos-map', loadPhotos);
});

var loadMap = function(link, map, fn) {
    var show = $(link).attr('show-map');
    if (show == "true") {
        $('#' + map).parent().hide();
        $(link).attr('show-map', false);
    } else {
        $('.poiproxy-map').parent().hide();
        $('#' + map).parent().show();
        $(link).attr('show-map', true);
        if (show === undefined) {
            fn(map);
        }
    }
};