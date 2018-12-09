//Dependencies
const path = require('path');

module.exports = function(app) {
    // Basic route that sends the user first to the AJAX Page
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/client/views/index.html"));
    });
};
