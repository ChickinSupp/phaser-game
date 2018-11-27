// *** main dependencies *** //
const express = require('express');
// *** express instance *** //
let app = express();
const server = require('http').Server(app);
const path = require('path');

app.use('/states',express.static(__dirname + '/resources/client/states'));
app.use('/js',express.static(__dirname + '/resources/client/js'));

const PORT =  process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

