const Request = require('../models/reqres/Request');
const Response = require('../models/reqres/Response');
const Brand = require('../database/models/Brand');
const Collection = require('../database/models/Collection');
const Watch = require('../database/models/Watch');

module.exports.search = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParams: true});

        let query = Request.validateText(req.params.query, 'query');

        console.log(query);

        //TODO search query for watch fields
        let watches = await Watch.find({$text: {$search: query}});

        //TODO search query for collection fields


        //TODO search query for brand fields

        return res.json(Response.payload({payload: watches}));

    }
    catch(error)
    {
        next(error);
    }
};