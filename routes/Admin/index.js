let router = require('express').Router();

router.use('/watches', require('./watches'));

router.use('/login', require('./login'));

router.use('/signup', require('./signup'));

module.exports = router;