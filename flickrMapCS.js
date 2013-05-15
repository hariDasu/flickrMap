	//-----------------------jQuery UI functions---------------
		$(function() {
			$('#toggle-full').click(function() {
				$('.slideUp').slideToggle('slow',function() {
			});
			});

			$('#slide-info').click(function() {
				$('#extra-info').slideToggle('slow',function() {
			});
			});
			
			$('#slide-info').click();
		});

		$(function() {
			$("#filter-flickr").click(function(){
				$(this).addClass("active");
				$("#filter-faves").removeClass("active");
				$("#filter-all").removeClass("active");
				$("#filter-njit").removeClass("active");

				})
			$("#filter-faves").click(function(){
				$(this).addClass("active");
				$("#filter-flickr").removeClass("active");
				$("#filter-all").removeClass("active");
				$("#filter-njit").removeClass("active");
				})

			$("#filter-all").click(function(){
				$(this).addClass("active");
				$("#filter-flickr").removeClass("active");
				$("#filter-faves").removeClass("active");
				$("#filter-njit").removeClass("active");
				})

			$("#filter-njit").click(function(){
				$(this).addClass("active");
				$("#filter-flickr").removeClass("active");
				$("#filter-faves").removeClass("active");
				$("#filter-all").removeClass("active");
				})
		})			
	//--------------------------------------------------------------------------
    // Hari and sagar
    // The image and url properties of the features will be used in
    // the tooltips

        var allPics=new Array() ;
        var baseSearchUrl="http://api.flickr.com/services/rest/?method=flickr.photos.search"
        var baseGeoUrl="http://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation"
        var key = "1aaf3af4ef3a09d2c06eaa4f072feba0"
        var mapLat = "40.742079"
        var mapLon = "-74.178840"
        var flickrFeatures=new Array() ;
        var flickrDict=[];

        // Create map
        var map = mapbox.map('map');
        map.addLayer(mapbox.layer().id('examples.map-vyofok3q'));

        // Set iniital center and zoom
        map.centerzoom({
            lat: mapLat,
            lon: mapLon,
        }, 14);

    //------------------- HTML  Client -----------------

    function addMarkerLayer(someFeatures) {
        console.log("adding layers"+someFeatures);
        // Create and add marker layer
        var markerLayer = mapbox.markers.layer().features(someFeatures);
        var interaction = mapbox.markers.interaction(markerLayer);
        map.addLayer(markerLayer);
        // Set a custom formatter for tooltips
        // Provide a function that returns html to be used in tooltip
        // the photoId will be used to turn on Mongo - fav attribute for key=photoId
        interaction.formatter(function(feature) {
            var photoId=feature.properties.photoId
            var o = "<a href=# id='" + photoId + "' onclick=addToFaves("+photoId+")>" +
                    '<img src="' + feature.properties.image + '">' +
                    '<h3>' + feature.properties.city + '</h3>' +
                    '</a>';
                return o;
        } )
    }
    //---------------------------------------------
    function storeInMongo(flickrFeatureSet){
    };

    //--------------- HTML CLIENT ---------------

    function addToFaves(photoId){
        console.log(photoId)
        alert("photoId: "+ photoId+" \n should be pushed to mongo")
    }

    //--------------  On Document Ready  HTML  CLIENT ----
    $(function() { 
         addMarkerLayer(features);
        
        $('#filter-flickr').click(function(){
                fetchAllPictures()
        })
    } )
        
