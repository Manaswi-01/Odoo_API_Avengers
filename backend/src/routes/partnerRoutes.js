const express = require('express');
const router = express.Router();
const { getPartners, createPartner } = require('../controllers/partnerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPartners).post(protect, createPartner);

module.exports = router;
