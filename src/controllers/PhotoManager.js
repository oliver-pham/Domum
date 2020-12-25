const fs = require("fs");
const path = require("path");

const MAIN_STORAGE_PATH = path.join(__dirname, "../../public");

module.exports = {
    storagePath: function (namespace) {
        const folder = path.join(MAIN_STORAGE_PATH, namespace.split(" ").join(''));
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        return folder;
    },
    addPhotos: function (room, files) {
        room.photos = [];
        for (var i = 0; i < files.length; i++) {
            // Photos are saved in the `public` folder
            const photoSrc = path.basename(files[i].destination) + '/' + files[i].filename;
            room.photos.push(photoSrc);
        }
    },
    addExternalPhotoLink: function (room) {
        delete room.isURL;
        room.photos = [room.photoSource];
        console.log(room.photos);
        
        delete room.photoSource;
    },
    removePhoto: function (src) {
        if (src) {
            const filePath = path.join(MAIN_STORAGE_PATH, src);
            console.log(filePath);
            console.log("*** Image " + src + " has been removed");
            fs.unlinkSync(filePath);
        }
        
    }
}