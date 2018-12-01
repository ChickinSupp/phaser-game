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

io.on('connection',function(socket){
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});
