'use strict';
//Dependencies
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

/**
 * Config
 */
// *** routes *** //
let app = express();
app.use(logger('dev'));
app.set('PORT', process.env.PORT || 3000);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../.')));


// Routes
// =============================================================
var routes = require('./index');
require("../../routes/htmlRoutes.js")(app);

// Starts the server to begin listening
// =============================================================
const server = app.listen(app.get('PORT'), () => {
    console.log('Express server listening on port ' + server.address().port);
});

const io = require('socket.io').listen(server);
let countPlayers = 0;
var rooms = {};

//If a connection is made
io.on('connect', function(socket){
    console.log( countPlayers, 'users connected');
});

module.exports = server;
