let router = require('express').Router();

router.use('/watches', require('./watches'));

router.use('/account', require('./account'));

module.exports = router;