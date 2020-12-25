// Testing Framework
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
// Database
const database = require("../../src/database");
// Room Module
const RoomManager = require("../../src/controllers/RoomManager");
// Sample Test Case
const SampleTestCase = require("../../config/RoomTestCase.json");

chai.use(chaiAsPromised);

if (!database.connected)
    database.start();

describe('find a room', function () {
    it('find an existing room by id SHOULD return one room', async function () {
        const foundRoom = await RoomManager.findById(SampleTestCase._id);
        expect(foundRoom).to.be.a('object');
        expect(foundRoom).to.have.keys(['_id', 'title', 'description', 'location', 'rating', 'price', 'amenities', 'photos', 'regulations', 'unavailability']);
        expect(foundRoom).to.be.deep.equal(SampleTestCase);
    });

    it('find a non-existent room by id SHOULD throw an error', async function () {
        return expect(() => {
            await RoomManager.findById("wrong _id");
        }).to.throw("This room hasn't been created yet!");
    });

    it('find existing room(s) by location SHOULD return an array of rooms', async function () {
        const rooms = await RoomManager.findByLocation("Toronto");
        expect(rooms).to.be.a('array');
    });
});