const express = require('express');
const { getAddOnServices, getAllAddOnService, getAddOnService, createAddOnService, updateAddOnService, deleteAddOnService } = require('../controllers/addonservices');
const { protect, authorize } = require('../middleware/auth');


const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getAddOnServices, getAllAddOnService).post(protect, authorize('admin'), createAddOnService);
router.route('/:id').get(getAddOnService).put(protect, authorize('admin'), updateAddOnService).delete(protect, authorize('admin'), deleteAddOnService);


module.exports = router;
