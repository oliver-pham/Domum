// Chai Framework
const chai = require("chai");
const chaiHTTP = require("chai-http");
const expect = chai.expect;
// Server
const server = require("../../../index");
// User Module
const UserManager = require("../../../controllers/UserManager");

chai.use(chaiHTTP);

describe('validate a user login', function () {
    before(async function () {
        const data = {
            email: "example@gmail.com",
            fname: "Stephen",
            lname: "Queen",
            password: "optimum"
        };
           
        await UserManager.create(data);
    });

    it('valid user SHOULD receive valid message', function (done) {
        const data = {
            email: "example@gmail.com",
            password: "optimum"
        };

        chai.request(server)
            .post('/api/users/login')
            .type('form')
            .send(data)
            .end((err, res) => {
                if (err) console.error(err);
                
                expect(res).to.have.status(200);
                expect(res.body).to.have.key('valid');
                expect(res.body.valid).to.be.a('boolean', "The attribute `valid` is not a boolean");
                expect(res.body.valid).to.be.true;
                done();
            });
    });

    it('invalid user SHOULD receive invalid message', function (done) {
        const data = {
            email: "wrongemail@gmail.com",
            password: "optimum"
        };

        chai.request(server)
            .post('/api/users/login')
            .type('form')
            .send(data)
            .end((err, res) => {
                if (err) console.error(err);

                expect(res).to.have.status(200);
                expect(res.body).to.have.keys(['valid', 'message']);
                expect(res.body.valid).to.be.a('boolean', "The attribute `valid` is not a boolean");
                expect(res.body.message).to.be.a('string', "The attribute `message` is not a string");
                expect(res.body.valid).to.be.false;
                done();
            });
    });

    after(async function () {
        await UserManager.delete({
            email: "example@gmail.com",
            password: "optimum"
        });
    });
});