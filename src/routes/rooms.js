// Express
const express = require("express");
const router = express.Router();
// Room Module
const RoomManager = require("../controllers/RoomManager");
// Photo Module
const PhotoManager = require("../controllers/PhotoManager");
// Multer
const upload = require("../controllers/upload");


router.get('/:id', async function (req, res) {
    try {
        const room = await RoomManager.findById(req.params.id);
        
        res.render('details', {
            auth: {
                profile: req.user,
                isAuthenticated: req.isAuthenticated(),
            },
            roomDetail: room,
            layout: false
        });
    } catch (err) {
        console.error(err);
        res.redirect('/explore');
    }
});

router.post('/create', upload.array("photo"), async function (req, res) {
    console.log(req.body);
    console.log(req.files);
  
    if (req.isAuthenticated()) {
      if (req.user.admin) {
        try {
          var roomRequest = req.body;
          if (req.body.isURL)
            PhotoManager.addExternalPhotoLink(roomRequest);
          else
            PhotoManager.addPhotos(roomRequest, req.files);
          const document = await RoomManager.create(roomRequest);
          console.log(document);
          
          setTimeout(() => {
            res.redirect('/dashboard');
          }, 300);
        } catch (err) {
          console.error(err);
          res.render('dashboard', {
            auth: {
              profile: req.user,
              isAuthenticated: req.isAuthenticated()
            },
            message: err.toString(),
            rooms: rooms,
            layout: false
          });
        }
      }
      else
        res.redirect('/dashboard');
    }
    else {
      res.redirect('/login');
    }
  });

router.post('/find', async function (req, res) {
    console.log(req.body);
    
    try {
        const rooms = await RoomManager.findByLocation(req.body.location);
        
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
        res.redirect('/explore');
    }
});

router.post('/update', async function (req, res) {
    console.log(req.body);

    if (req.isAuthenticated) {
        if (req.user.admin) {
            try {
                const room = await RoomManager.update(req.body.roomId, req.body);
                PhotoManager.removePhoto(req.body.photoSrc);
                res.redirect('/rooms/' + room._id);
            } catch (err) {
                console.error(err);
                res.redirect('/rooms/' + req.body.roomId);
            }
        }
        else
            res.redirect('/dashboard');
    }
    else {
        res.redirect('/explore');   
    }
    
});

router.post('/delete', async function (req, res) {
    console.log(req.body);
    
    if (req.isAuthenticated()) {
        if (req.user.admin) {
            try {
                const room = await RoomManager.delete(req.body.roomId);
                for (var i = 0; i < room.photos.length; i++) {
                    PhotoManager.removePhoto(room.photos[i]);
                }
                res.redirect('/dashboard');
            } catch (err) {
                console.error(err);   
            }
        }
        else {
            res.redirect('/dashboard');
        }
    }
    else {
        res.redirect('/explore');
    }
});


module.exports = router;