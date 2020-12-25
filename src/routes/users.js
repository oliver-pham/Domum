const express = require("express");
const router = express.Router();
// API Security
const cors = require("cors");
const helmet = require("helmet");
// User Module
const UserManager = require("../../controllers/UserManager");

// Enhance API security
router.use(helmet());

// Enable CORS for all requests
router.use(cors());

router.post('/login', async function (req, res) {
    console.log("Inside POST /api/user/login callback");
    try {
        await UserManager.validateLogin(req.body);
        res.json({ valid: true });
    } catch (err) {
        console.error(err);
        res.json({ valid: false, message: err.toString() });
    }
});

module.exports = router;