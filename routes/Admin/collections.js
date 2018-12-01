const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const collections = require('../../controllers/Admin/collections');

router.post('/', passport.authenticate('jwt-admin', {session: false}), collections.create);

router.get('/', collections.readAll);

router.get('/:_id', collections.readById);

module.exports = router;