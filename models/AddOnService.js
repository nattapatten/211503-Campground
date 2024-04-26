const mongoose = require('mongoose');

const AddOnServiceSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        required: [true, 'Please specify the type of service'],
        enum: ['firewood', 'equipment rental', 'food', 'guided tours', 'other'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description of the service']
    },
    price: {
        type: Number,
        required: false, // Price is not required at schema level to allow for dynamic pricing
    },
    dynamicPrice: {
        type: Boolean,
        default: false // Indicates if the price needs to be determined at the time of booking
    },
    quantityAvailable: {
        type: Number,
        min: 0,
        required: false // Not all services might need a quantity (e.g., guided tours)
    },
    campground: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campground',
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now

    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});



module.exports = mongoose.model('AddOnService', AddOnServiceSchema);
