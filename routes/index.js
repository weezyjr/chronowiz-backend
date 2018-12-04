let router = require('express').Router();

router.use('/admin', require('../routes/Admin/index.js'));

router.use('/user', require('../routes/User/index.js'));

module.exports = router;