
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
                $("#delete-faves").removeClass("active");
				})
			$("#filter-faves").click(function(){
				$(this).addClass("active");
				$("#filter-flickr").removeClass("active");
                $("#delete-faves").removeClass("active");
				})
			$("#delete-faves").click(function(){
				$(this).addClass("active");
				$("#filter-flickr").removeClass("active");
				$("#filter-faves").removeClass("active");
				})

		})			
	//--------------------------------------------------------------------------
    // Hari and sagar
    // The image and url properties of the features will be used in
    // the tooltips
        
        var markerLayer = null;
        var allPics=new Array() ;
        var baseSearchUrl="http://api.flickr.com/services/rest/?method=flickr.photos.search"
        var baseGeoUrl="http://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation"
        var key = "1aaf3af4ef3a09d2c06eaa4f072feba0"
        var mapLat = "40.6893"
        var mapLon = "-74.0446"
        var maplat = "40.742079"
        var maplon = "-74.178840"
        var flickrFeatures=new Array() ;
        var flickrDict=[];
        var featureDict=[];

        // Create map
        var map = mapbox.map('map');
        map.addLayer(mapbox.layer().id('examples.map-vyofok3q'));

        // Set iniital center and zoom
        map.centerzoom({
            lat: mapLat,
            lon: mapLon,
        }, 14);

    //------------------- HTML  Client -----------------

    function getFaves(){
        //console.log(photoId)
       //alert("photoId : "+ photoId+" \n  pushing to mongo")
       console.log("getting faves");
        $.ajax(
            {
             url:'/getfaves'  ,
            type: "GET",
     contentType: "application/json; charset=utf-8",
        dataType: "json",
          }
        ).done ( function (data) {
          // faves = JSON && JSON.parse(data)
          addMarkerLayer(data);
         // console.log("got" + data);
        } )
    }
    //-----------------------------------------------------------------
    function deleteFaves(){
        //console.log(photoId)
       //alert("photoId : "+ photoId+" \n  pushing to mongo")
       console.log("deleting faves");
        $.ajax(
            {
             url:'/delfaves'  ,
          }
        ).done ( function (data) {
          addMarkerLayer(data);
          console.log("removed" + data);
        } )
    }
    //-----------------------------------------------------------------
    function addMarkerLayer(someFeatures) {
        console.log("adding layers"+someFeatures);
        // Create and add marker layer
        markerLayer = mapbox.markers.layer().features(someFeatures);
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
    //--------------- HTML CLIENT ---------------

    function addToFaves(photoId){
        console.log(photoId)
       alert("photoId : "+ photoId+" \n  pushing to mongo")
        var oneFeature = featureDict[photoId]
        $.ajax(
            {
             url:'/addFave'  ,
            type: "POST",
            data: JSON.stringify(oneFeature),
     contentType: "application/json; charset=utf-8",
        dataType: "json",
          }
        ).done ( function (data) {
         console.log("got" + data);
        } )
    }

//----------------------- SERVER SIDE ------------------------
function fetchGeotags(picArray)
{
    flickrFeatures.length=0   // array
    flickrDict.length=0       // a dict just to remember the photoUrl
    featureDict.length=0   // feature dictionary

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
               geoTag  = geo
               var longi = geoTag.photo.location.latitude
               var lati = geoTag.photo.location.longitude
               console.log("geoTag"+geoTag)
               var photoUrl=flickrDict[geoTag.photo.id] ;
               console.log(photoUrl);
               var oneFeature= {
                    "geometry": {"type": "Point", "coordinates":[lati,longi] },
                    "properties": {
                        "image": photoUrl,
                          "url":  "#",
                         "city": "add to favorites",
                      "photoId":  geoTag.photo.id,
                     }
               }
               flickrFeatures.push (oneFeature)
               featureDict[geoTag.photo.id] = oneFeature

               if (flickrFeatures.length == allPics.length ) {
                    console.log(flickrFeatures);
                     addMarkerLayer(flickrFeatures)
                    // we now have a new set of flickr pics - stick them into mongo (replace)
                    // storeInMongo(flickrFeatures);
               }
    
            } )
    })
}
//-----------------------  SERVER SIDE  --------------------------
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
               //format : 'json', 
               nojsoncallback : 1,
              dataType: "jsonp"
              },
          } 
       ) 
       .done( function(data) {
            console.log ("Got all Pics - about to call fetchGeoTags")
            stuff = data
            allPics=stuff.photos.photo
            console.log(allPics)
            fetchGeotags(allPics);
      })
}

    //--------------  On Document Ready  HTML  CLIENT ----
mongoRet= [
  {
    "geometry": {
      "type": "Point",
      "coordinates": [
        -74.038469,
        40.685449
      ]
    },
    "properties": {
      "image": "http://farm9.static.flickr.com/8538/8696777268_5530b17b0c_q.jpg",
      "url": "#",
      "city": "add to favorites",
      "photoId": "8696777268"
    },
    "_id": "5180672c86b3d54f22000001"
  },
  {
    "geometry": {
      "type": "Point",
      "coordinates": [
        -74.036575,
        40.68611
      ]
    },
    "properties": {
      "image": "http://farm9.static.flickr.com/8121/8695703961_212fd079ea_q.jpg",
      "url": "#",
      "city": "add to favorites",
      "photoId": "8695703961"
    },
    "_id": "5180672e86b3d54f22000002"
  }
]

    $(function() { 
        // addMarkerLayer(features);
        
        $('#filter-flickr').click(function(){
            if(markerLayer!=null ) {
             markerLayer.features([])
            };
            fetchAllPictures();
        })

        $('#filter-faves').click(function(){
            if(markerLayer!=null ) {
                markerLayer.features([])
            };
            //addMarkerLayer(mongoRet)
             getFaves();
        });
        $('#delete-faves').click(function(){
            if(markerLayer!=null ) {
                markerLayer.features([])
            };
            //addMarkerLayer(mongoRet)
             deleteFaves();
        });
    } )
        
