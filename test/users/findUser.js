const assert = require("assert");
const database = require("../../database");
const UserManager = require("../../controllers/UserManager");
require("dotenv").config();

if (!database.connected)
    database.start();

describe('find a user', function () {
    describe('by email', function () {
        before(async function () {
            const data = {
                email: "example@gmail.com",
                fname: "Stephen",
                lname: "Queen",
                password: "optimum"
            };
               
            await UserManager.create(data);
        });

        it('valid email', async function () {
            const data = {
                email: "example@gmail.com",
                password: "optimum"
            };

            try {
                const user = await UserManager.validateLogin(data);
                assert.strictEqual(user.email, data.email);
                assert.strictEqual(typeof user.fname, "string"); 
                assert.strictEqual(typeof user.lname, "string");
                // password is not returned
                assert.equal(user.password, undefined)
                
            } catch (err) {
                console.error(err);
            }
        });

        it('invalid email', async function () {
            const data = {
                email: "nonexistent@gmail.com",
                password: "somepassword"
            };

            assert.rejects(async () => {
                const user = await UserManager.validateLogin(data);
                console.log(user);
            }, TypeError('No User Found'));
            
        });

        after(async function () {
            await UserManager.delete({
                email: "example@gmail.com",
                password: "optimum"
            });
        });
    });
});