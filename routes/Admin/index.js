let router = require('express').Router();

router.use('/brands', require('./brands'));
router.use('/collections', require('./collections'));
router.use('/watches', require('./watches'));

router.use('/account', require('./account'));

module.exports = router;