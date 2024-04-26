const mongoose = require('mongoose');

const AddOnServiceDetailsSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        ref: 'AddOnService',
        required: false
    },
    serviceType: {
        type: String,
        required: [false, 'Please specify the type of service'],
        enum: ['firewood', 'equipment rental', 'food', 'guided tours', 'other'],
        trim: true
    },
    description: {
        type: String,
        required: [false, 'Please provide a description of the service']
    },
    price: {
        type: Number,
        required: false, // Price is not required at schema level to allow for dynamic pricing
    },
    dynamicPrice: {
        type: Boolean,
        default: false // Indicates if the price needs to be determined at the time of booking
    },
    quantity: {
        type: Number,
        min: 0,
        required: false // Not all services might need a quantity (e.g., guided tours)
    }
}, {
    _id: false // Prevent Mongoose from creating a separate _id for this subdocument
});

const BookingSchema = new mongoose.Schema({
    bookingDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    campground: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campground',
        required: true
    },
    addOnServices: [AddOnServiceDetailsSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);


// const mongoose = require('mongoose');

// const BookingSchema = new mongoose.Schema({
//     bookingDate: {
//         type: Date,
//         required: true
//     },
//     user: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: true

//     },
//     campground: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Campground',
//         required: true

//     },
//     addOnServices: [{
//         type: mongoose.Schema.ObjectId,
//         ref: 'AddOnService'
        
//     }],
//     createdAt: {
//         type: Date,
//         default: Date.now

//     }
// });


// module.exports = mongoose.model('Booking', BookingSchema);