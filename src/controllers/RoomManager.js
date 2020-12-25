const Room = require("../models/Room");
// UUID
const uuid = require("uuid");

// TODO: Find by availability
module.exports = {
    create: async (room) => {
        try {
            room._id = uuid.v4();
            const document = new Room(room);

            return await document.save();
        } catch (err) {
            console.error(err);
            throw '*Invalid room!';
        }
    },
    find: async (query) => {
        try {
            if (query)
                return await Room.findOne(query).lean();
            else
                return await Room.find().lean();
        } catch (err) {
            console.error(err);
            throw "*This room hasn't been created yet!";
        }
    },
    findById: async (_id) => {
        try {
            if (uuid.validate(_id))
                return await Room.findById(_id).lean();
            else
                throw "*Invalid Room ID!";
        } catch (err) {
            console.error(err);
            throw "*This room hasn't been created yet!";
        }
    },
    findByLocation: async (location) => {
        try {
            return await Room.find({ location: location }).lean();
        } catch (err) {
            console.error(err);
            throw "*This room hasn't been created yet!";
        }
    },
    retrieveBookedRooms: async (bookings) => {
        try {
            return await Promise.all(bookings.map(async (booking) => {
                const room = await Room.findById(booking.roomId);
                const checkInDate = new Date(booking.period[0]);
                const checkOutDate = new Date(booking.period[1]);
                
                return {
                    _id: room._id,
                    title: room.title,
                    rating: room.rating,
                    price: room.price,
                    location: room.location,
                    photos: room.photos,
                    checkInDate: checkInDate.getDate().toString() + '-' + (checkInDate.getMonth() + 1).toString() + '-' + checkInDate.getFullYear().toString(),
                    checkOutDate: checkOutDate.getDate().toString() + '-' + (checkOutDate.getMonth() + 1).toString() + '-' + checkOutDate.getFullYear().toString(),
                };
            }));
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    update: async (_id, room) => {
        try {
            var update = {};

            if (!uuid.validate(_id))
                throw "*Invalid Room ID!";

            if (room.title) {
                update.title = room.title.toString();
            }
            if (room.description) {
                update.description = room.description.toString();
            }
            if (room.location) {
                update.location = room.location.toString();
            }
            if (room.price) {
                update.price = parseFloat(room.price);
            }
            if (room.rating) {
                update.rating = parseFloat(room.rating);
            }
            if (room.photoSrc) {
                update.$pull = { photos: room.photoSrc };
            }

            return await Room.findByIdAndUpdate(_id, update).lean();
        } catch (err) {
            console.error(err);
            throw '*Invalid room!';
        }
    },
    book: async (_id, checkInDate, checkOutDate) => {
        try {
            const bookingPeriod = [ new Date(checkInDate), new Date(checkOutDate) ];
            
            const room = await Room.findByIdAndUpdate(_id, { $push: { unavailability: bookingPeriod }}).lean();

            return {
                room: room,
                period: bookingPeriod
            };
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    delete: async (_id) => {
        try {
            return await Room.findByIdAndDelete(_id).lean();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}