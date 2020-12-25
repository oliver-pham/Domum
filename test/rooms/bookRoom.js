// Testing Framework
const chai = require("chai");
const expect = chai.expect;
// Database
const database = require("../../database");
// Room Module
const RoomManager = require("../../controllers/RoomManager");

if (!database.connected)
    database.start();

describe('book a room', function () {
    it('book a room by id SHOULD return one room with booked period', async function () {
    
    });
});