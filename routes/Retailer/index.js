let router = require('express').Router();

router.use('/watches', require('./watches'));

module.exports = router;