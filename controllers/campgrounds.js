// const { parse } = require('dotenv');
const Campground = require('../models/Campground');
// const { param } = require('../routes/campgrounds');
// const vacCenter = require('../models/VacCenter');



// exports.getCampgrounds=(req,res,next)=>{
//     console.log(req.body);
//     res.status(200).json({success:true,msg:'Show all campgrounds'});
// };


exports.getCampgrounds = async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    const removeField = ['select', 'sort', 'page', 'limit'];
    removeField.forEach(param => delete reqQuery[param]);
    console.log("getCampgrounds:",reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // query = Campground.find(JSON.parse(queryStr)).populate('appointments'); //Edit by nattapat.p  Change appointment to bookings
    query = Campground.find(JSON.parse(queryStr))
    .populate({
        path: 'bookings',
        select: 'bookingDate user' // Optionally specify fields to fetch
    })
    .populate({
        path: 'addonservices', // Add this line to populate add-on services
        select: 'serviceType description price availability' // Optionally specify fields to fetch
    });


    //Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Campground.countDocuments();

    query = query.skip(startIndex).limit(limit);


    try {
        const campgrounds = await query;

        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1, limit
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1, limit
            }
        }



        console.log(req.query)
        res.status(200).json({ success: true, count: campgrounds.length, pagination, data: campgrounds });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }

};




// exports.getCampground=(req,res,next)=>{
//     console.log(req.body);
//     res.status(200).json({success: true, msg: `Show campground ${req.params.id}`});
// };




exports.getCampground = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: campground });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};





// exports.createCampground=(req,res,next)=>{
//     console.log(req.body);
//     res.status(200).json({success:true,msg:'Create new campground'});
// };

exports.createCampground = async (req, res, next) => {
    const campground = await Campground.create(req.body);
    res.status(201).json(
        {
            success: true,
            data: campground
        });
};



// exports.updateCampground=(req,res,next)=>{
//     console.log(req.body);
//     res.status(200).json({success: true, msg: `Update campground ${req.params.id}`});
// };


exports.updateCampground = async (req, res, next) => {
    try {
        const campground = await Campground.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!campground) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: campground });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};



// exports.deleteCampground=(req,res,next)=>{
//     console.log(req.body);
//     res.status(200).json({success: true, msg: `Delete campground ${req.params.id}`});
// };

exports.deleteCampground = async (req, res, next) => {
    try {

        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            // return res.status(400).json({ success: false, message: `Campground not found with id of ${req.params.id}` });
            return res.status(400).json({ success: false });
        }

        // console.log(`Campground found with id of ${campground}` )
        await campground.deleteOne();
        res.status(200).json({ success: true, data: {} });

    }
    catch (err) {
        console.error(err);
        res.status(400).json({ success: false });
    }
};

//This Version Can Connect to MongoDB





// exports.getVacCenters = (req, res, next) => {
//     vacCenter.getAll((err, data) => {

//         if (err)
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving Vaccine Centers."
//             });
//         else res.send(data);

//     });
// };