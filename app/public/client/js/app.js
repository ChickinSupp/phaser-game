$(document).ready( function() {
    $('#chat').hide();
    let gamer = 0;
    //let socket = io().connect('localhost:5000');
    let tempRoom = Math.floor(Math.random() * 500);
    let tempViewId = Math.floor((Math.random() * 100) + 100);
    let myRoom, myId;

    socket.emit('create-room', {gameRoom: tempRoom,  viewId: tempViewId});

    // Query DOM
    let message = document.getElementById('message'),
        handle = document.getElementById('handle'),
        btn = document.getElementById('send'),
        output = document.getElementById('output');

    // Emit events
    btn.addEventListener('click', function(){
        socket.emit('chat', {
            message: message.value,
            handle: handle.value
        });
        message.value = "";
    });

    message.addEventListener('keypress', function(){
        socket.emit('typing', handle.value);
    });

    socket.on('typing', function(data){
        feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
    });

    // Listen for events
    socket.on('chat', function(data){
        feedback.innerHTML = '';
        output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    });

    //close chat
    socket.on('close-chat', function () {
        output.innerHTML = '';
        $('#chat').hide();
    });

    //Successful room creation 1 & 2
    socket.on('success-create', function (room, id) {
        console.log('NEW ROOM: ' + room);
        console.log('NEW ID: ' + id);
        myRoom = room;
        myId = id;
    });

    //New player
    socket.on('player-joined', function (data) {
        console.log('Number of players: ' + data);
    });

    //Too many players
    socket.on('fail-join', function () {
        console.log('FAILED TO JOIN ..too many players');
    });

    //Ready after two players
    socket.on('start-game', function (data) {
        $('#chat').show(1000);
        if (data === myId) {
            console.log('Ready to start game from: ', gamer, ' room', data );
            socket.emit('game-start', myRoom, myId);
        }
    });

    /*
    GET CHOSEN CHARACTERS FROM THE GAME
    When players are selected
     */

    socket.on('my-player', function (data) {
        let myPlayer, hisPlayer;
        let playerCounter = 0;
        playerCounter++;

        if (playerCounter <= 2) {
            if (data.bol ===true) {
                myPlayer = data.name;
                console.log(" My Selection = ", playerCounter,  data.name);
            } else {
                hisPlayer = data.name;
                console.log(" His Selection ", playerCounter, ' = ', data.name);
            }
        }

        if (playerCounter === 2 ) {
            socket.broadcast.emit('your-player', { name: hisPlayer });
            game.state.start('game');
            getPlayer(myPlayer);
        }
    });

    socket.on('success-join', function (playerNum) {
        if (playerNum === 1) {
            console.log("dude:", playerNum);
            gamer = playerNum;
        } else {
            console.log("comp:", playerNum);
            gamer = playerNum;
        }
    });
});



