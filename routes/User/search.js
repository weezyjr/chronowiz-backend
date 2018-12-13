const router = require('express').Router({mergeParams: true});

const search = require('../../controllers/search');

router.get('/:query', search.search);

module.exports = router;