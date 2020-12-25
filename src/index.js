// Database
const database = require("./database");
// App
const app = require("./app");
// Settings
const Settings = require("./settings");

// Connect to MongoDB
database.start();

const server = app.listen(Settings.PORT, function () {
  console.log("Express http server listening on: " + Settings.PORT);
});

module.exports = server;
