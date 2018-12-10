$(document).ready( function() {
    let gamer = 0;
    let socket = io().connect('localhost:5000');
    let tempRoom = Math.floor(Math.random() * 500);
    let tempViewId = Math.floor((Math.random() * 100) + 100);
    let myRoom, myId;

    socket.emit('create-room', {gameRoom: tempRoom,  viewId: tempViewId});

    socket.on('success-create', function (room, id) {
        console.log('NEW ROOM: ' + room);
        console.log('NEW ID: ' + id);
        myRoom = room;
        myId = id;
    });

    socket.on('player-joined', function (data) {
        console.log('Number of players: ' + data);
    });

    socket.on('fail-join', function () {
        console.log('FAILED TO JOIN ..too many players');
    });

    socket.on('start-game', function (data) {
        if (data === myId) {
            console.log('Ready to start game from: ', gamer, ' room', data );
            socket.emit('game-start', myRoom, myId);
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


















        /*Get playerID from server
        socket.on('new-player', (data) => {
            countPlayers++;
            console.log('NUMBER OF PLAYERS: ' + countPlayers);
            console.log('MY ID IS ', data.id);
            myRoom = data.room;
            //Log the room id
            console.log(`My game room ID is: ${myRoom}`);

            /* code to get chosen
            * from the character selection
            * state
             */


            /*if(!(isTaken) && (countPlayers = 1)) {
                chosen = chars[countPlayers - 1];
                isTaken = true;
            } else if ((isTaken) && (countPlayers = 2)){
                chosen = chars[countPlayers -1];
                isTaken = false;
            }
            getCharacter('dude');
        });

        socket.on('all-gamers', (data) => {
            console.log(data);
            if (data.length === 2) {
                switchView(chars[0], chars[1]);     //=======>>>>>>REMEMBER TO CHANGE!!!!
            }
        });

        //Updates game while being played
        socket.on('game-update', (data) => {

        });

        //Assigns game character to player
        const getCharacter = (data) => {
            for (let x = 0; x < chars.length; x++) {
                if (data === chars[x]) {
                    tempPlayer = chars[x];
                    console.log("tempPLayer: " + tempPlayer);
                    break;
                }
            }
            socket.emit('got-one', tempPlayer);
        };

        function switchView (player1, player2) {
            getPlayer(player1, player2);
            game.state.start('state1', true);
        }*/



});



