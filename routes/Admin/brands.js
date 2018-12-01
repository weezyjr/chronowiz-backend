const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const brands = require('../../controllers/Admin/brands');

router.post('/', passport.authenticate('jwt-admin', {session: false}), brands.create);

router.get('/', brands.readAll);

router.get('/:_id', brands.readById);

module.exports = router;