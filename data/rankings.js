// Dependencies
// =============================================================

var Sequelize = require("sequelize");
var sequelize = require("../config/connection.js");

// Creates a "Rankings" model that matches up with DB
var Rankings = sequelize.define("rankings", {
  player: Sequelize.STRING,
  style: Sequelize.STRING,
  created_at: Sequelize.DATE
});

// Syncs with DB
Rankings.sync();

// Makes the Rankings Model available for other files (will also create a table)
module.exports = Rankings;