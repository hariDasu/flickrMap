/*
  The functions in this module is the server side code 
  Purpose :
  1. Connect to Flickr and fetch pics  periodically
  2. We use AJAX to fetch the pictures from FLICKR
  3. The apps.js module invokes these functions 
  4. The fetched pictures will be added to mongodb  photoDB.photos collection
*/

var $=require('jquery')
var allPics=new Array() ;
var baseSearchUrl="http://api.flickr.com/services/rest/?method=flickr.photos.search"
var baseGeoUrl="http://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation"
var key = "1aaf3af4ef3a09d2c06eaa4f072feba0"
var mapLat = "40.742079"
var mapLon = "-74.178840"
var flickrFeatures=new Array() ;
var flickrDict=[];
//----------------------- SERVER SIDE ------------------------
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
        $.getJSON(
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
          } ,
          function (geo) {
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
                    // addMarkerLayer(flickrFeatures)
                    // we now have a new set of flickr pics - stick them into mongo (replace)
                    // storeInMongo(flickrFeatures);
               }
          }
        )
    })
}
//-----------------------  SERVER SIDE  --------------------------
exports.fetchAllPictures=function() {
     //---- build the URL ----
     $.getJSON(
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
               nojsoncallback : 1
              } ,
              dataType: "jsonp",
          } 
       ) 
       .done( function(data) {
            console.log ("here")
            stuff = JSON && JSON.parse(data) || $.parseJSON(data)
            allPics=stuff.photos.photo
            console.log(allPics)
            fetchGeotags(allPics);
      })
}



