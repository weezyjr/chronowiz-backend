let router = require('express').Router();

router.use('/admin', require('../routes/Admin'));

router.use('/user', require('../routes/User'));

router.use('/retailer', require('../routes/Retailer'));

module.exports = router;