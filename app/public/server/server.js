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
app.use(express.static(path.join(__dirname, '../client')));

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
let players = [];
let waitList = [];
let activeRooms = [];

//If a connection is made
io.on('connect', (socket) => {
    console.log(' A user connected');
    console.log('His ID is ', socket.id);
    players.push(socket.id.toString());
    waitList.push(socket.id.toString());

    console.log('All players: ', players);
    console.log('Waitlist', waitList);

    //Send the id and potential room to to client;
    socket.emit('new-player', { id: socket.id, room: waitList[0] });

    //Create GameRooms
    if (waitList.length === 2) {
        socket.join(waitList[0], () => {
            let rooms = Object.keys(socket.rooms);
            console.log(rooms);     // [ <socket.id>, 'room 237' ]
            io.to(waitList[0]).emit('new player has joined the room'); // broadcast to everyone in the room
        });
        waitList.length = 0;       //Clear Waitlist array for next opponents

    } else if (waitList.length === 1) {
        console.log("Waiting for another player to join");
    }

    //Updates game while being played
    socket.on('game-update', (data) => {

    });
    // Check for 'disconnect emit'
    socket.on('disconnect', () => {
        console.log('A player disconnected');

    });

});



module.exports = server;

