// Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// Controllers
const UserManager = require("./UserManager");

// Local Authentication Strategy
passport.use(new LocalStrategy(
  { usernameField: 'email'},
  async (submittedEmail, submittedPassword, done) => {
    console.log("Inside local strategy callback")
    // Find the user in the database
    try {
      const user = await UserManager.validateLogin({ email: submittedEmail, password: submittedPassword });
      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err, false);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log("Inside serializeUser callback. User id is saved to the session file store here");
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  console.log("Inside deserializeUser() callback");
  console.log(`The user id passport saved in the session file store is: ${_id}`);
  try {
    done(null, await UserManager.retrieveProfile(_id));
  } catch (err) {
    done(err, false);
  }
});

module.exports = passport;