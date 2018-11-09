let router = require('express').Router();

router.use('/admin', require('../routes/Admin/index.js'));

router.use('/search', require('../routes/Search/index.js'));

module.exports = router;