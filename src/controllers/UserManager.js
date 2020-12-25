const bcrypt = require("bcrypt");
const User = require("../models/User");

// email format: example.com
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const CORP_EMAIL_REGEX = /@domum\.com$/;
const PASSWORD_REGEX = /^[A-Za-z]\w{5,15}$/;
const SALT_ROUNDS = 10;

module.exports = {
    create: async function (user) {
        console.log("Inside user create() method");
        var newUser = new User();
        newUser.fname = user.fname.trim();
        newUser.lname = user.lname.trim();

        // Validate email
        if (!user.email || !EMAIL_REGEX.test(user.email.trim()))
            throw '*Invalid Email';
        else
            newUser.email = user.email;
        // Validate password
        if (!user.password || !PASSWORD_REGEX.test(user.password))
            throw '*Invalid Password';

        if (user.date && user.month && user.year) {
            newUser.dob = new Date(parseInt(user.year), parseInt(user.month), parseInt(user.date));
        }

        try {

            const salt = await bcrypt.genSalt(SALT_ROUNDS);
            const hash = await bcrypt.hash(user.password, salt);
            newUser.password = hash;
            // TODO: Attach admin hash if the email belongs to our corporate
            if (CORP_EMAIL_REGEX.test(user.email)) {
                console.log("Admin account detected");
                newUser.admin = true;
                console.log(newUser);
            }
            const savedUser = await newUser.save();
            
            return {
                email: savedUser.email,
                fname: savedUser.fname
            };

        } catch (err) {
            throw "*Cannot create your account";
        }
    },
    validateLogin: async function (user) {
        console.log("Inside user validateLogin() method");
        // Validate email
        if (!user.email || !EMAIL_REGEX.test(user.email.trim()))
            throw '*Invalid Email';
        // Validate password
        if (!user.password || !PASSWORD_REGEX.test(user.password))
            throw '*Invalid Password';

        try {

            const matchingUser = await User.findOne({ email: user.email });
            const same = await bcrypt.compare(user.password, matchingUser.password);

            if (same) {
                return {
                    _id: matchingUser._id,
                    email: matchingUser.email,
                    fname: matchingUser.fname,
                    lname: matchingUser.lname
                };
            }
            else {
                throw '*Wrong password';
            }

        } catch (err) {
            throw '*Wrong email or password';
        }
    },
    retrieveProfile: async function (_id) {
        console.log("Inside user retrieveUser() method");
        try {
            return await User.findById(_id).lean();
        } catch (err) {
            throw "*Cannot find your account";
        }
    },
    addBooking: async function (userId, booking) {
        console.log("Inside user addBooking() method");
        try {
            if (!booking.roomId)
                throw "*Invalid room ID";
            
            return await User.findByIdAndUpdate(userId, { $push: { bookings: booking }}).lean();
        } catch (err) {
            console.error(err);
            throw "*Cannot book this room!";
        }
    },
    delete: async function (user) {
        console.log("Inside user delete() method");
        // Validate email
        if (!user.email || !EMAIL_REGEX.test(user.email.trim()))
            throw TypeError('Invalid Email');
        // Validate password
        if (!user.password || !PASSWORD_REGEX.test(user.password))
            throw TypeError('Invalid Password');

        try {
            const matchingUser = await User.findOne({ email: user.email });
            const same = await bcrypt.compare(user.password, matchingUser.password);

            if (same) {
                await User.deleteOne({
                    email: user.email
                });
            }
            else
                throw TypeError('Wrong Password');
            
        } catch (error) {
            throw error;
        }
    }
};
