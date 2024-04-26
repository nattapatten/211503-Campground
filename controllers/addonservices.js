const AddOnService = require('../models/AddOnService');
const Campground = require('../models/Campground');



exports.getAddOnServices = async (req, res, next) => {
    try {
        let query;

        if (req.user.role !== 'admin') {
            console.log("not admin")
            console.log({ user: req.user.id })
            query = AddOnService.find({ user: req.user.id }).populate({
                path: 'campground',
                select: 'name province tel'
            });
        } else {
            if (req.params.campgroundId) {
                console.log(req.params.campgroundId);
                console.log("admin")
                query = AddOnService.find({ campground: req.params.campgroundId }).populate({
                    path: 'campground',
                    select: 'name province tel'
                });
            } else {
                query = AddOnService.find().populate({
                    path: 'campground',
                    select: 'name province tel'
                });
            }

            try {

                const addonservices = await query;

                res.status(200).json({
                    success: true,
                    count: addonservices.length,
                    data: addonservices
                });

            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Cannot find Add-On-Service" });

            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Add-On-Service" });

    }

};




exports.getAddOnService = async (req, res, next) => {
    try {
        const addonservice = await AddOnService.findById(req.params.id);
        if (!addonservice) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: addonservice });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};




exports.createAddOnService = async (req, res, next) => {
    const addonservice = await AddOnService.create(req.body);
    res.status(201).json(
        {
            success: true,
            data: addonservice
        });
};



exports.updateAddOnService = async (req, res, next) => {
    try {
        const addonservice = await AddOnService.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!addonservice) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: addonservice });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};



exports.deleteAddOnService = async (req, res, next) => {
    try {

        const addonservice = await AddOnService.findById(req.params.id);
        if (!addonservice) {
            // return res.status(400).json({ success: false, message: `Campground not found with id of ${req.params.id}` });
            return res.status(400).json({ success: false });
        }

        // console.log(`Campground found with id of ${campground}` )
        await addonservice.deleteOne();
        res.status(200).json({ success: true, data: {} });

    }
    catch (err) {
        console.error(err);
        res.status(400).json({ success: false });
    }
};