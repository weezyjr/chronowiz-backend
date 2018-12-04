let router = require('express').Router();

router.use('/brands', require('./brands'));
router.use('/collections', require('./collections'));
router.use('/watches', require('./watches'));
router.use('/search', require('./search'));

router.use('/account', require('./account'));

module.exports = router;