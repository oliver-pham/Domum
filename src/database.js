const mongoose = require('mongoose');
const Settings = require("./settings");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

module.exports = {
    connected: false,
    start: () => {
        // Database Connection
        mongoose.connect(Settings[Settings.ENV].db)
            .then(() => {
                this.connected = true;
            })
            .catch(err => {
                console.error(err)
                process.exit(1);
            });
    }
}