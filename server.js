// Config file
var settings                = require('./server_config/settings.json');

// Libraries
var fs                      = require('fs');
var async                   = require('async');
var express                 = require('express');
var app                     = express();
var server                  = require('http').createServer(app);
var io                      = require('socket.io').listen(server);
var bodyParser              = require('body-parser');

// Internals
var indexController         = require('./app/node_controllers/indexController');
var launchTestController    = require('./app/node_controllers/launchTestController');
var resultsController       = require('./app/node_controllers/resultsController');
var waitingQueueSocket      = require('./app/node_controllers/waitingQueueSocket');
var testQueue               = require('./app/lib/testQueue');

app.use(bodyParser.urlencoded({ extended: false }));


// Routes definition
app.get('/',                    indexController);
app.post('/launchTest',         function(req, res) { launchTestController(req, res, testQueue); });
app.get('/results/:testId',     resultsController);


// Static files
app.use('/public',              express.static(__dirname + '/app/public'));
app.use('/bower_components',    express.static(__dirname + '/bower_components'));


// Socket.io
io.on('connection', function(socket){
    waitingQueueSocket(socket, testQueue);
});



// Launch the server
server.listen(settings.serverPort, function() {
    console.log('Listening on port %d', server.address().port);
});