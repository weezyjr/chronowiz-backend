const router = require('express').Router({mergeParams: true});

const search = require('../../controllers/search');

router.get('/:query', search.search);

router.get('/advanced/:query', search.advancedSearch);

module.exports = router;
