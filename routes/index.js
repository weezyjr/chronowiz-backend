let router = require('express').Router();

router.use('/admin', require('../routes/Admin/index.js'));

module.exports = router;