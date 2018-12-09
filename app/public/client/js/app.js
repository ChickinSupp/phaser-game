$(document).ready( function() {
    let socket = io().connect('localhost:5000');
    let myRoom = "";        //potential room id for this client

    //Get playerID from server
    socket.on('new-player', (data) => {
        console.log('MY ID IS ', data.id);
        myRoom = data.room;
        //Log the room id
        console.log(`My game room ID is: ${myRoom}`);
    });



    function Menu (){

    }

    Menu.prototype = {
        preload: () => {

        },
        create: () => {

        },
        update: () => {

        }
    };

    function updateGame() {
        // sends game-update to server with the players input and player number
        socket.emit('game-update', {});
    }

});



