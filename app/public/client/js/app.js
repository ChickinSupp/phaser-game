$(document).ready( function() {
    $('#chat').hide();
    let isHidden = true;
    //let socket = io().connect('localhost:5000');
    let myRoom;

    // Query DOM
    let message = document.getElementById('message'),
        handle = document.getElementById('handle'),
        btn = document.getElementById('send'),
        output = document.getElementById('output');

    // Emit events
    btn.addEventListener('click', function() {
        socket.emit('chat', {
            message: message.value,
            handle: handle.value,
            room: myRoom
        });
        message.value = "";
    });

    message.addEventListener('keypress', function(){
        socket.emit('typing', {handle: handle.value, room: myRoom});
});

    socket.on('typing', function(data) {
        feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
    });

    // Listen for events
    socket.on('newchat', function(data){
        feedback.innerHTML = '';
        output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    });

    //close chat
    socket.on('close-chat', function () {
        if (!isHidden) {
            output.innerHTML = '';
            $('#chat').hide();
        }
    });

    //New player
    socket.on('player-joined', function (data) {
        console.log('Number of players: ' + data);
    });

    //Too many players
    socket.on('fail-join', function () {
        console.log('FAILED TO JOIN ..too many players');
    });

    socket.on('success-join', function (room) {
        if (isHidden) {
            isHidden = false;
            $('#chat').show(1000);
        }
        myRoom = room;
    });
});



