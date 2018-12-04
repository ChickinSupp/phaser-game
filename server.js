//Dependencies
const express = require('express');
let app = express();
const server = require('http').Server(app);
const bodyParser = require("body-parser");
const io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));
const PORT =  process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
// =============================================================
require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);

// Starts the server to begin listening
// =============================================================
server.listen(PORT, () => {
    console.log(`App now listening on port ${PORT}`);
});

var count = 0;

//If a new connection is detected
io.on('connect', function(socket) {
    count++;
    console.log('Number of players ' + count);
});

// Check for 'disconnect emit'
io.on('disconnect', function() {
    count--;
    console.log('user disconnected' + count + 'left');
});
