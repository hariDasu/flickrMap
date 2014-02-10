var connect = require('connect');
var express = require('express');
var app = express();
var flickrMapSS = require('./flickrMapSS.js');
var path = require('path');
var http = require('http');
var photos = require('./routes/index');
//var xdomain = require('./jquery.xdomainajax');

app.configure(function () {
    app.set('port', process.env.PORT || 28341);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.static('./flickrMapSS.js'));
   // app.use(express.static('./jquery.xdomainajax.js'));
	app.use(express.static(path.join(__dirname)));
});

app.get('/', function(req,res) {
	res.sendfile(__dirname + 'flickrMap.html');
})
app.delete('/',function(req,res){
	res.sendfile(__dirname + 'flickrMap.html');
})


//app.get('/', .flickrMap.html);


app.post('/addfave', photos.addFave);
app.get('/getfaves', photos.findAll);
app.get('/delfaves', photos.deleteFaves);

//-----------------------------------------------------------------------
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});	
var io = require('socket.io').listen(server);


