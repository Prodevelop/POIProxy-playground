var demoTemplate = '<div class="container"><div class="row demo-template"></div></div>';
$('#poiproxy-news').click(function() {
    var show = $('#poiproxy-news').attr('show-map');
    if (show == "true") {
        $('#poiproxy-news-map').parent().hide();
        $('#poiproxy-news').attr('show-map', false);
    } else {
        $('#poiproxy-news-map').parent().show();
        $('#poiproxy-news').attr('show-map', true);
        if (show === undefined) {
            loadNewsPlugin('poiproxy-news-map');
        }
    }
});