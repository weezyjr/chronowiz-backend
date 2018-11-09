const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const search = require('../../controllers/Search/search');

router.post('/', search.search);

module.exports = router;