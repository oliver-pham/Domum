// Access Environment Variables
require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 8080,
    ENV: process.env.NODE_ENV || "development",
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    sendgrid: {
        sender: process.env.SENDGRID_EMAIL
    },
    SECRET: process.env.SECRET || 'keyboard cat',
    "development": {
        db: process.env.LOCAL_DATABASE
    },
    "production": {
        db: process.env.CLOUD_DATABASE
    }
}