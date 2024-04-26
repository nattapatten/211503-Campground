const Booking = require('../models/Booking');
const Campground = require('../models/Campground');
const mongoose = require('mongoose');

exports.getBookings = async (req, res, next) => {
    console.log("getBookings")

    let query;

    if (req.user.role !== 'admin') {
        console.log("not admin")
        console.log({ user: req.user.id })
        query = Booking.find({ user: req.user.id }).populate({
            path: 'campground',
            select: 'name province tel'
        });
    } else {
        if (req.params.campgroundId) {
            console.log(req.params.campgroundId);
            console.log("admin")
            query = Booking.find({ campground: req.params.campgroundId }).populate({
                path: 'campground',
                select: 'name province tel'
            });
        } else {
            query = Booking.find().populate({
                path: 'campground',
                select: 'name province tel'
            });
        }

        try {

            const bookings = await query;

            res.status(200).json({
                success: true,
                count: bookings.length,
                data: bookings
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Cannot find Booking" });

        }
    }
}

// const user = await User.findById(req.user.id);
// res.status(200).json({
//     success: true,
//     data: user
// }

exports.getMyBookings = async (req, res, next) => {
    console.log("getMyBookings")

    let query;
    try {
        query = Booking.find({ user: req.user.id }).populate({
            path: 'campground',
            select: 'name province tel'
        });
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Booking" });

    }
}


exports.getBooking = async (req, res, next) => {
    console.log("getBooking")
    try {

        const booking = await Booking.findById(req.params.id).populate({
            path: 'campground',
            select: 'name description tel'
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: `No booking with the id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Booking" });

    }

}

exports.addBooking = async (req, res, next) => {
    console.log("addBooking")
    try {
        req.body.campground = req.params.campgroundId;

        console.log(req.body.campground);
        const campground = await Campground.findById(req.params.campgroundId);

        if (!campground) {
            return res.status(404).json({ success: false, message: `No campground with the id of ${req.params.campgroundId}` });
        }

        req.body.user = req.user.id;

        const existedBookings = await Booking.find({ user: req.user.id });

        if (existedBookings.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: `The user with ID ${req.user.id} has already made 3 bookings` });
        }


        //Add by nattapat.p
        // Create an array to store add-on services
        const addOnServices = [];

        // Loop through the provided add-on services and add them to the array
        if (req.body.addOnServices && Array.isArray(req.body.addOnServices)) {
            for (const addOnService of req.body.addOnServices) {
                // Correctly use 'new' to create a new ObjectId instance
                addOnServices.push({ _id: new mongoose.Types.ObjectId(addOnService._id) });
            }
        }

        // Set the add-on services array in the request body
        req.body.addOnServices = addOnServices;
        //End Add by nattapat.p



        const booking = await Booking.create(req.body);
        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot create Booking" });
    }
}


exports.updateBooking = async (req, res, next) => {
    try {

        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: `No booking with the id of ${req.params.id}` });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.params.id} is not authorized to update this booking` });
        }

        //Add by nattapat.p
        // Create an array to store add-on services
        const addOnServices = [];

        // Loop through the provided add-on services and add them to the array
        if (req.body.addOnServices && Array.isArray(req.body.addOnServices)) {
            for (const addOnService of req.body.addOnServices) {
                // Correctly use 'new' to create a new ObjectId instance
                addOnServices.push({ _id: new mongoose.Types.ObjectId(addOnService._id) });
            }
        }

        // Set the add-on services array in the request body
        req.body.addOnServices = addOnServices;
        //End Add by nattapat.p



        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: booking
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot update Booking" });
    }
}



exports.deleteBooking = async (req, res, next) => {
    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: `No booking with the id of ${req.params.id}` });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.params.id} is not authorized to delete this booking` });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot delete Booking" });
    }
}

