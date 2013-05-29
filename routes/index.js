var mongo = require('mongodb');
/*
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('faves', server, {safe: true});

var features = [{
            "photo_id" : "p1",
            "fave" : false,
            "geometry": { "type": "Point", "coordinates": [-74.18002,40.743042]},
            "properties": {
                "image": "http://graphics.fansonly.com/schools/njit/graphics/auto/athleticbuilding.gif",
                "url": "http://www.njit.edu",
                "city": "GYM"
            }
        }, {

            "photo_id" : "p2",
            "geometry": { "type": "Point", "coordinates": [-74.178446,40.742551]},
            "fave" : false,
            "properties": {
                "image": "http://conferenceservices.njit.edu/images/kupfrian-hall.jpg",
                "url": "http://www.njit.edu/campustour/vt14-kupfrian.php",
                "city": "Kupfrian Hall"
                
            }
        }, {
            "photo_id" : "p3",
            "geometry": { "type": "Point", "coordinates": [-74.17873,40.741874]},
            "fave" : false,
            "properties": {
                "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/NYC_Montage_2011.jpg/275px-NYC_Montage_2011.jpg",
                "url": "http://en.wikipedia.org/wiki/New_York_City",
                "city": "FMH"
                
            }
            }, {
            "photo_id" : "p4",
            "fave" : false,
            "geometry": { "type": "Point", "coordinates": [-74.178373,40.743075]},
            "properties": {
                "image": "http://campuscenter.njit.edu/campuscenternight.jpg",
                "url": "http://en.wikipedia.org/wiki/New_York_City",
                "city": "Campus Center"
                
            }
            
        }];

function storeInMongo(someFeatures) {
    photoCollection.insert(someFeatures, function(err,result) {
        if (err) {
            return console.dir(err) ;
        }
        console.log(result)
    } )   
}

var url = require( "url" );
var queryString = require( "querystring" );

*/

//-----------------------------------------------------------------------
// Connect to the db
var MongoClient = require('mongodb').MongoClient;
var henryDB = null;
var photoCollection = null;
//-----------------------------------------------------------------------------
MongoClient.connect("mongodb://localhost:27017/henryDB", function(err, db) {
    if(err) {
        console.dir(err);     // cannot connect to DB
    } else {
        henryDB=db
        db.createCollection('photos',{w:1}, function(err, collection) {
            if (err) {
                console.dir(err) ;    // cannot create collection
            } else  {
                photoCollection = collection;
                collection.remove( function(err,result) {
                    if (err) {
                        console.dir(err)   // cannot remove collection
                    } else {
                        console.log(result)
                        console.log("We are connected");
                    }
                } );    
            }
        }); 
    }
}) ;

//------------------------------------------------
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving favorite: ' + id);
    henryDB.collection('photos', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
//------------------------------------------------
// Called when user clicks "Show Favorites"
// Note : all records in our photos collection are favourites
//        hence we simply do a findAll and return the resuting array

exports.findAll = function(req, res) {
    henryDB.collection('photos', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

//------------------------------------------------
// Called when user clicks "Add to favorites" on the map
// Purpose :  insert a single feature into the mongo photos collection
// TODO:  We must check if this is record exists already (using photoId)
//        This check will prevent multiple records for the same photo

exports.addFave = function(req, res) {
    queryData=""
    req.on('data', function(data) {
        queryData += data;
    });
    req.on('end', function() {
        // response.post = querystring.parse(queryData);
        console.log (queryData)
        stuff = JSON && JSON.parse(queryData) || $.parseJSON(queryData)
        henryDB.collection('photos', function(err, collection) {
            collection.insert(stuff, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    res.send(result[0]);
                }
            });
        });
    });

}

//------------------------------------------------
// TODO : We must add a button to "Unfavorite" a single photo
//        how do we form the url on the client side ??
// 

exports.deleteFaves = function(req, res) {
        // response.post = querystring.parse(queryData);
   henryDB.collection('photos', function(err, collection) {
        collection.remove( function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('All document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
