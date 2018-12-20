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
let playersOnline = 0;
let myRoom;
let rooms = [];
let waitList = [];


//When a player connects
io.on('connect', function(socket) {
    let myPlayer = '';
    let myOpponent = '';
    playersOnline++;
    console.log('A user connected', socket.id, ' at number ', playersOnline );

    if(playersOnline === 1 || playersOnline % 2 !== 0) {
        let newRoom = {
            roomId: socket.id,
            players: 1,
            started: false
        };
        rooms.push(newRoom);
        console.log(rooms);
    } else if (playersOnline === 2 || playersOnline % 2 === 0) {
        matchMake(socket);
    } else {
        waitList.push(socket);
        socket.emit('fail-join');
    }

    /*
    CHAT EVENTS
     */
    // Handle chat event
    socket.on('chat', function(data){
        console.log(data, ' msg to ', data.room);
        io.sockets.in(data.room).emit('newchat', data);
    });

    // Handle typing event
    socket.on('typing', function(data) {
        socket.broadcast.to(data.room).emit('typing', data.handle);
    });

    //On disconnect
    socket.on('disconnect', function () {
        console.log('Someone left', socket.id);
        playersOnline--;

        //Check and remove the room from rooms if there are no connections
        for (let i = 0; i < rooms.length; i++) {
            let num = 0;
            let connections = io.sockets.adapter.rooms[rooms[i].roomId];

            if (connections) {
                num = connections.length;
            } else {
                num = 0;
            }
            console.log('NUM: ', num);

            if ( num === 1 ) {
                rooms[i].players = 1;
                rooms[i].started = false;
                console.log(rooms, 'After room becomes 1');
                io.to(rooms[i].roomId).emit('close-chat');
            } else if ( num === 0 ) {
                rooms = rooms.filter(room => room.roomId !== rooms[i].roomId);
                console.log(rooms, 'After room became vacant');
            }
        }
    });

    //Listen for player
    socket.on('my-player', (data) => {
        console.log(data, 'LINE 66 app.js');
        myPlayer = data.fighter;
        socket.broadcast.to(myRoom).emit('opponent-picked', myPlayer);
        // Ready after two players
        if ((myPlayer !== '') && (myOpponent !== '')) {
            console.log("Opponent is Here line 131");
            socket.broadcast.to(myRoom).emit('start-game', { myplayer: myPlayer, opponent: myOpponent });
        }
    });

    // Save opponent
    socket.on('opponent', (opponent) => {
        console.log(opponent, ' IS OPPONENT AFTER SELECTION');
        myOpponent = opponent;
        // Ready after two players
        if ((myPlayer !== '') && (myOpponent !== '')) {
            console.log("Opponent is Here line 131");
            socket.broadcast.to(myRoom).emit('start-game', { myplayer: myPlayer, opponent: myOpponent });
        }
    });
});

//Matchmaking
const matchMake = (socket) => {
    //Loop through the rooms to find an available room to join
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].players === 1) {
            console.log('Found Room. Joining...');
            socket.join(rooms[i].roomId);
            rooms[i].players = 2;
            rooms[i].started = true;
            io.to(rooms[i].roomId).emit('success-join', rooms[i].roomId);
            myRoom = rooms[i].roomId;
            console.log('ROOMS: ', rooms);
        }
    }
};


module.exports = server;