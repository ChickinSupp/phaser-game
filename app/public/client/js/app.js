$(document).ready( function() {
    let socket = io().connect('localhost:5000');
    let countPlayers = 0;
    let myRoom = "";        //potential room id for this client
    let chars = ['dude', 'comp'];
    let chosen = '';
    let tempPlayer;
    let isTaken = false;

    socket.on('connect', () => {

        //Get playerID from server
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
            }*/
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
        }

    });


});



