// *** main dependencies *** //
const express = require('express');
const path = require('path');


// *** express instance *** //
let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let PORT =  process.env.PORT || 3000;

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

