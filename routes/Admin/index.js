let router = require('express').Router();

router.use('/account', require('./account'));

router.use('/brands', require('./brands'));
router.use('/collections', require('./collections'));
router.use('/watches', require('./watches'));

router.use('/retailers', require('./retailers'));

router.use('/orders', require('./orders'));

module.exports = router;
