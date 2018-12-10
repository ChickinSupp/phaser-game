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
let counter = 0;
let rooms = {};
let partialRoom = 0;
let partialId = 0;
let currentRoom;
let activeIds = [];
let waitList = [];

io.on('connect', function(socket) {
    console.log('a user connected');
    counter++;

    //connect new player to the room
    socket.on('create-room', function(data){
        //Implement player count
        if (counter <= 2) {
            if(!rooms[data.gameRoom] && partialRoom === 0) {

                //Create gameroom with generated id and set started to false
                console.log('Creating room... GameRoom:', data.gameRoom);
                rooms[data.gameRoom] = {id: data.viewId};
                rooms[data.gameRoom].started = false;
                rooms[data.gameRoom].players = counter;
                console.log(counter);
                socket.room = data.gameRoom;
                socket.join(data.viewId);
                activeIds.push(data.viewId);
                partialRoom = data.gameRoom;
                partialId = data.viewId;
                console.log('Successfully joined player 1 to ' + partialId );
                socket.emit('success-create', partialRoom, partialId);
                console.log("ROOM PLAYERS " + rooms[partialRoom].players);
                console.log("ROOMS: ", rooms);
                joiner(counter, partialRoom, partialId);
            } else if (partialId !== 0 && rooms[partialRoom].players === 1){
                socket.join(partialId);
                console.log('Successfully joined player 2');
                socket.emit('success-create', partialRoom, partialId);
                rooms[partialRoom].players++;
                console.log("ROOMS: ", rooms);
                joiner(counter, partialRoom, partialId);
            } else {
                console.log('Too many players... LINE 70 server');
            }
        } else {
            waitList.push(socket.id);
            console.log('WAITLIST', waitList);
            socket.emit('waiting');
            //checkWait(socket);
        }


        function joiner(counter, partialRoom, partialId) {
            console.log('JOINER PARAMS: ', counter, partialRoom, partialId);
            //Join a player to a room
            if(counter <= 2 ) {
                io.sockets.in(rooms[partialRoom].id)
                    .emit('player-joined', rooms[partialRoom].players);

                let playerId =  rooms[partialRoom].players;
                console.log("PLAYERID FROM LINE 78: ", playerId);
                socket.emit('success-join', playerId);
            } else if (counter > 2){
                socket.emit('fail-join');
            }

            //Start game
            if (rooms[partialRoom].players === 2) {
                io.sockets.in(rooms[partialRoom].id).emit('start-game', rooms[partialRoom].id);
                console.log(rooms[partialRoom], 'from line 93');
                currentRoom = partialRoom;
            }
            else {
                console.log('Error: Inadequate players for start-game emit');
            }
        }

    });

     /*function checkWait(socket) {
         if(waitList.length > -1){
             for(let i = 0; i < waitList.length; i++) {
                socket.join(waitList[0]);
             }
         }
     }*/

    //reset vars for other room
    function resetTempRoom () {
        partialRoom = 0;
        partialId = 0;
    }

    //Updates game while being played
    socket.on('game-update', function(data) {
        if (rooms[socket.room]) {
            io.sockets.in(rooms[socket.room].id).emit('game-update', data);
        }
    });

    // Check for 'start-game' emit
    socket.on('game-start', function(room, id) {
        console.log(rooms[socket.room], currentRoom, 'line 118');
        //wait for player 2
        if (rooms[socket.room]) {
            console.log('GameRoom:', room, 'ID: ', id);
            rooms[room].started = true;
            console.log("ROOMS: ", rooms, ' from game-start line 122ish..??');
            resetTempRoom();
        }

    });

    // Check for 'disconnect emit'
    socket.on('disconnect', function(){
        console.log('user disconnected');
        counter--;
        rooms[currentRoom].started = false;
        rooms[currentRoom].players--;
        console.log(rooms);
        //checkWait(socket);
    });
});



module.exports = server;

