// Testing Framework
const chai = require("chai");
const expect = chai.expect;
// Database
const database = require("../../src/database");
// Room Module
const RoomManager = require("../../src/controllers/RoomManager");
// Sample Test Case
const SampleTestCase = require("../../config/RoomTestCase.json");

if (!database.connected)
    database.start();

// TODO: This feature depends on the method `create` of the Room Module
describe('update a room', function () {

    it('an existing room SHOULD be updated and returned', async function () {

        const room = await RoomManager.findById(SampleTestCase._id);

        room.title = "updated title";
        console.log(room);
        
        const updatedRoom = await RoomManager.persist(room);

        expect(updatedRoom).to.have.keys(['_id', 'title', 'description', 'location', 'rating', 'price']);
        expect(updatedRoom.title).to.eql("update title");
        expect(updatedRoom.description).to.eql(data.description);
        expect(updatedRoom.location).to.eql(data.location);
        expect(updatedRoom.rating).to.be.eql(data.rating);
        expect(updatedRoom.price).to.be.eql(data.price);
    });

});