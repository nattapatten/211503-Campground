const mongoose = require('mongoose');

const CampgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']

    },
    address: {
        type: String,
        required: [true, 'Please add an address']

    },
    district: {
        type: String,
        required: [true, 'Please add a district']

    },
    province: {
        type: String,
        required: [true, 'Please add a province']

    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postalcode'],
        maxlength: [5, 'Postal Code can not be more than 5 digits']

    },
    tel: {
        type: String
    },
    region: {
        type: String,
        required: [true, 'Please add a region']

    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});


CampgroundSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'campgournd',
    justOne: false

});


//Start Add by nattapat.p 
// Adding a new virtual for add-on services
CampgroundSchema.virtual('addonservices', {
    ref: 'AddOnService',
    localField: '_id',
    foreignField: 'campground', //foreignField was used by controller file
    justOne: false
});
//End Add by nattapat.p 


CampgroundSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    console.log(`Bookings and Add-On Services being removed from campgournd ${this._id}`);
    await this.model('Booking').deleteMany({ campgournd: this._id });
    await this.model('AddOnService').deleteMany({ campground: this._id }); //Add by nattapat.p 
    next();
});




// CampgroundSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
//     console.log(`Bookings being removed from campgournd ${this._id}`);
//     await this.model('Booking').deleteMany({ campgournd: this._id });
//     next();
// });



module.exports = mongoose.model('Campground', CampgroundSchema);