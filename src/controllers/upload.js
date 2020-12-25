const PhotoManager = require("./PhotoManager");
const path = require("path");
const multer = require("multer");

// Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = PhotoManager.storagePath(req.body.location);
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;