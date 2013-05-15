
        <script>
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
        //------------------------------------------------------------
        function fetchAllPictures() {
             //---- build the URL ----
             $.ajax(
                      {
                          url:  baseSearchUrl, 
                          data : {
                           api_key :  key,
                           lat :  mapLat,
                           lon :  mapLon,
               accuracy: 6,
                           format : 'json',
                           jsonp: "jsoncallback",
                           dataType: "jsonp",
                           //format : 'json', 
                           nojsoncallback : 1
                          }
                      } 
                   ) 
                   .done( function(data) {
                        //console.log ("here")
                        stuff = JSON && JSON.parse(data) || $.parseJSON(data)
                        allPics=stuff.photos.photo
                        console.log(allPics)
                        fetchGeotags(allPics);
                  })
        }

        //------------------------------------------------------------
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
        //------------------------------------------------------------
        function fetchGeotags(picArray)
        {
            flickrFeatures.length=0
            flickrDict.length=0
            $.each(picArray, function(i,item) {
                //turn photo id into a variable
                var photoID = item.id;
                var photoUrl = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_q.jpg'
                flickrDict[photoID]=photoUrl

                console.log(item.photoUrl);
                $.ajax(
                  {
                      url:  baseGeoUrl, 
                      data : {
                       api_key :  key,
                       format : 'json',
                       photo_id : photoID,
                       jsonp: "jsoncallback",
                       dataType: "jsonp",
                       //format : 'json', 
                       nojsoncallback : 1
                      }
                  } 
                ) .done( function(geo) {
                       geoTag  = JSON && JSON.parse(geo) || $.parseJSON(geo)
                       var longi = geoTag.photo.location.latitude
                       var lati = geoTag.photo.location.longitude
                       console.log("geoTag"+geoTag)
                       var photoUrl=flickrDict[geoTag.photo.id] ;
                       console.log(photoUrl);
                       flickrFeatures.push ( 
                           {
                            "geometry": {"type": "Point", "coordinates":[lati,longi] },
                            "properties": {
                                "image": photoUrl,
                                  "url":  "#",
                                 "city": "add to favorites",
                  "photoId":  geoTag.photo.id,
                             }
                           }
                       )
                       if (flickrFeatures.length == allPics.length ) {
                            console.log(flickrFeatures);
                            addMarkerLayer(flickrFeatures)
                // we now have a new set of flickr pics - stick them into mongo (replace)
                storeInMongo(flickrFeatures);
                       }
            
                    } )
            })
        }
    //---------------------------------------------
    function storeInMongo(flickrFeatureSet){
    };
        //-------------------------------------------
    function addToFaves(photoId){
            console.log(photoId)
        alert("photoId: "+ photoId+" \n should be pushed to mongo")
    }

        $(function() { 
             addMarkerLayer(features);
            
        $('#filter-flickr').click(function(){
                fetchAllPictures()
        })
            } )
        
