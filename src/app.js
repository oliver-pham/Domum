// Sever
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
// View Engine
const handlebars = require("express-handlebars");
// Controllers
const Notifier = require("./controllers/Notifier");
const UserManager = require("./controllers/UserManager");
const RoomManager = require("./controllers/RoomManager");
// Session
const session = require("express-session");
const FileStore = require("session-file-store")(session);
// Passport
const passport = require("./controllers/passport");
// Settings
const Settings = require("./settings");
// Room Router
const RoomRouter = require("./routes/rooms");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  cookie: {
    maxAge: 1000 * 60 * 60 * 48
  },
  store: new FileStore(),
  secret: Settings.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Static
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../views')));
app.use('/rooms', express.static(path.join(__dirname, '../public')));
app.use('/rooms', express.static(path.join(__dirname, '../views')));

// Handlebars
app.engine('.hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');


// GET
app.get('/', function (req, res) {

  res.render('main', {
    auth: {
      profile: req.user,
      isAuthenticated: req.isAuthenticated()
    },
    layout: false
  });
});

app.get('/explore', async function (req, res) {
  try {
    const rooms = await RoomManager.find();

    res.render('explore', {
      auth: {
        profile: req.user,
        isAuthenticated: req.isAuthenticated()
      },
      rooms: rooms,
      layout: false
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }  
});

app.get('/become-a-host', function (req, res) {
  console.log("Session ID:", req.sessionID);

  res.render('host', {
    auth: {
      profile: req.user,
      isAuthenticated: req.isAuthenticated()
    },
    layout: false
  });
});

app.get('/thank-you', function (req, res) {
  res.render('thankyou', {
    auth: {
      profile: req.user,
      isAuthenticated: req.isAuthenticated()
    },
    layout: false
  });
});

app.get('/dashboard', async function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.admin) {
      try {
        const rooms = await RoomManager.find();
      
        res.render('dashboard', {
          auth: {
            profile: req.user,
            isAuthenticated: req.isAuthenticated()
          },
          rooms: rooms,
          layout: false
        });
      } catch (err) {
        console.error(err);
        res.render('dashboard', {
          auth: {
            profile: req.user,
            isAuthenticated: req.isAuthenticated()
          },
          layout: false
        });
      }
    }
    else {
      try {
        const user = await UserManager.retrieveProfile(req.user._id);
        const rooms = await RoomManager.retrieveBookedRooms(user.bookings);

        res.render('dashboard', {
          auth: {
            profile: req.user,
            isAuthenticated: req.isAuthenticated()
          },
          rooms: rooms,
          hasBookings: rooms.length > 0,
          layout: false
        });
      } catch (err) {
        console.error(err);
        res.render('dashboard', {
          auth: {
            profile: req.user,
            isAuthenticated: req.isAuthenticated()
          },
          layout: false
        });
      }
    }
  }
  else {
    res.redirect('/login');
  }
});

app.get('/login', function (req, res) {
  res.render('login', {
    layout: false
  });
});

app.get('/registration', function (req, res) {
  res.render('registration', {
    layout: false
  });
});

app.get('/logout', function (req, res) {
  req.session.destroy((err) => {
    if (err)
      console.error(err);
    
    res.redirect('/');
  });
});

// POST
app.post('/register', function (req, res) {
  console.log("Inside POST /register callback");
  console.log(req.body);
  
  // Create a User
  UserManager.create(req.body)
    .then((document) => {
      let welcomeMessage = "<h2>Ahoy! Shall we get started, " + document.fname + "? Verify your account now: https://bitly.com/98K8eH</h2>";
      Notifier.notifyByEmail(document.email, "Domum: Welcome Message", welcomeMessage);
      // Wait for the user to be serialized into the session
      setTimeout(() => {
        res.redirect(307, '/login');
      }, 500);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Invalid Credentials");
    });
});

app.post('/login', function (req, res) {
  console.log("Inside POST /login callback");
  passport.authenticate('local', (err, user, info) => {
    if (info)
      console.log(info.message);

    if (err) {
      console.error(err);
      res.render('login', {
        message: err.toString(),
        layout: false
      });
    }
    else {
      req.login(user, (err) => {
        if (err) {
          console.error(err);
          res.render('login', {
            message: err.toString(),
            layout: false
          });
        }
        else
          res.redirect('/dashboard');
      });
    }
  })(req, res);
});

app.post('/book', async function (req, res) {
  console.log(req.body);

  try {
    const booking = await RoomManager.book(req.body.roomId, req.body.checkIn, req.body.checkOut);
    const user = await UserManager.addBooking(req.user._id, { roomId: booking.room._id, period: booking.period });
    console.log(booking);
    console.log(user);
    
    const accommodationCost = parseFloat(booking.room.price * Math.ceil(Math.abs(booking.period[1] - booking.period[0]) / (1000 * 60 * 60 * 24)));
    const cleaningFee = parseFloat(accommodationCost * 14 / 100);
    const serviceFee = parseFloat(accommodationCost * 20 / 100);
    const bookingDetail = `
      <h1>Thank you for your booking! Check your booking detail below:</h1>
      <h2>Your booking: ${booking.room.title}</h2>
      <p>Location: ${booking.room.location}</p>
      <p>Base cost (per night): ${booking.room.price}</p>
      <p>Accommodation: ${accommodationCost}</p>
      <p>Cleaning fee: ${cleaningFee}</p>
      <p>Service fee: ${serviceFee}</p>
      <h2>Total (after HST): ${parseFloat((accommodationCost + cleaningFee + serviceFee) * 1.13).toFixed(2)}</h2>
    `;

    Notifier.notifyByEmail(user.email, "Domum: Order Confirmation", bookingDetail);

    res.render('thankyou', {
      auth: {
        profile: req.user,
        isAuthenticated: req.isAuthenticated()
      },
      layout: false
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred! Please try booking your room later.");
  }
});

app.use('/rooms', RoomRouter);


module.exports = app;