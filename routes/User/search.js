const router = require('express').Router({mergeParams: true});

const search = require('../../controllers/search');

router.post('/', search.search);

module.exports = router;