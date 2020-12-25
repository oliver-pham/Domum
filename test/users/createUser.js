const assert = require("assert");
const database = require("../../database");
const UserManager = require("../../controllers/UserManager");

if (!database.connected)
    database.start();

describe('create a user', function () {
    before(async function () {
        const data = {
            email: "valid@gmail.com",
            fname: "Charlie",
            lname: "Brow",
            password: "nonutnovember"
        };
           
        await UserManager.create(data);
    });

    it('valid user', async function () {
        const randStr = Math.random().toString(36).substring(7);
        const data = {
            email: randStr + "@gmail.com",
            fname: "John",
            lname: "Doe",
            password: "arandompwd"
        };
        
        try {
            
            const user = await UserManager.create(data);
            assert.strictEqual(user.email, data.email);
            assert.strictEqual(user.fname, data.fname); 
            assert.strictEqual(user.lname, data.lname);
            // password is not returned
            assert.equal(user.password, undefined)

        } catch (err) {
            console.error(err);
        }
    });

    it('invalid email', async function () {
        const data = {
            email: "invalid email",
            fname: "John",
            lname: "Doe",
            password: "avalidpass"
        };
           
        assert.rejects(async () => {
            await UserManager.create(data);
        }, TypeError('Invalid Email'));
    
    });

    it('invalid password', async function () {
        const data = {
            email: "valid@gmail.com",
            fname: "John",
            lname: "Doe",
            password: "abc"
        };
           
        assert.rejects(async () => {
            await UserManager.create(data);
        }, TypeError('Invalid Password'));
        
    });

    it('duplicate email', async function () {
        const data = {
            email: "valid@gmail.com",
            fname: "Charlie",
            lname: "Brow",
            password: "nonutnovember"
        };

        assert.rejects(async () => {
            await UserManager.create(data);
        }, Error);
        
    });

    after(async function () {
        await UserManager.delete({
            email: "valid@gmail.com",
            password: "nonutnovember"
        });
    });
});