const Request = require('../models/reqres/Request');
const Response = require('../models/reqres/Response');
const Watch = require('../database/models/Watch');

module.exports.search = async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let query = Request.validateText(req.body.payload.query, 'query');

        let watches = await Watch.find({'referenceNumber': query}).populate('brandObject').populate('collectionObject');

        // let watchesMatchBrand = await Watch.find({'referenceNumber': query});
        //
        // let watchesMatchCollection = await Watch.find({'referenceNumber': query});
        //
        // let watchesMatchCollection = await Watch.find({'referenceNumber': query});

        return res.json(Response.payload({payload: watches}));
    }
    catch (error)
    {
        next(error);
    }
};