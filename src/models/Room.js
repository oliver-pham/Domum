const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

const Room = new Schema({
    "_id": Schema.Types.String,
    "title": {
        type: Schema.Types.String,
        required: true
    },
    "description": {
        type: Schema.Types.String,
        required: true
    },
    "location": {
        type: Schema.Types.String,
        required: true
    },
    "rating": {
        type: Schema.Types.Number,
        min: 0,
        max: 5.0,
        default: 0
    },
    "price": {
        type: Schema.Types.Number,
        default: 0
    },
    "photos": [Schema.Types.String],
    "amenities": [Schema.Types.String],
    "regulations": [Schema.Types.String],
    "unavailability": [[Schema.Types.Date]]
});

module.exports = mongoose.model("Rooms", Room);