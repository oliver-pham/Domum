// Testing Framework
const assert = require("assert");
// Database
const database = require("../../src/database");
// Room Module
const RoomManager = require("../../src/controllers/RoomManager");
const Room = require("../../src/models/Room");
// Sample Test Case
const SampleTestCase = require("../../config/RoomTestCase.json");

if (!database.connected)
    database.start();

describe('create a room', function () {
    it('a valid room SHOULD be saved and returned', async function () {
        const room = await RoomManager.create(SampleTestCase);
        assert.ok(room instanceof Room);
    });

    it('an invalid room SHOULD return an error', function () {
        let testCase = SampleTestCase
        testCase.price = "Very expensive";

        assert.rejects(async () => {
            await RoomManager.create(testCase);
        }, 'Invalid room!');
    });
});