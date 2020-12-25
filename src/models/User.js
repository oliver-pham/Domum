const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');
mongoose.set('useCreateIndex', true);

const User = new Schema({
    "email": {
        type: Schema.Types.String,
        unique: true,
        required: true
    },
    "fname": Schema.Types.String,
    "lname": Schema.Types.String,
    "dob": Schema.Types.Date,
    "password": Schema.Types.String,
    "admin": { 
        type: Schema.Types.Boolean,
        default: false
    },
    "bookings": [new Schema({
        roomId: Schema.Types.String,
        period: [Schema.Types.Date]
    })]
});

module.exports = mongoose.model("Users", User);