const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const Brand = require('../../database/models/Brand');
const Collection = require('../../database/models/Collection');
const Watch = require('../../database/models/Watch');
const Retailer = require('../../database/models/Retailer');
const validator = require('validator');
const ErrorType = require('../../models/errors/ErrorType');

module.exports.AddToStockById = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true});

        let retailer = await Retailer.findById(req.user._id).populate('watchObjects.watch');
        if(!retailer)
            return done({en: 'This Retailer is not registered', errorType: ErrorType.UNAUTHORIZED});

        let watch = await Watch.findById(req.params._id);
        if(!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        let existingWatch = retailer.watchObjects.find(retailerWatch => retailerWatch.watch.referenceNumber === watch.referenceNumber);
        if(existingWatch)
            return res.json(Response.error({en: 'Watch already exists in the retailer\'s stock watches.'}));

        retailer.watchObjects.addToSet({watch: watch, retailerWatchDiscount: 0});

        await retailer.save();

        return res.json(Response.payload({payload: retailer}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.RemoveFromStockById = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true});

        let retailer = await Retailer.findById(req.user._id).populate('watchObjects.watch');
        if(!retailer)
            return done({en: 'This Retailer is not registered', errorType: ErrorType.UNAUTHORIZED});

        let watch = await Watch.findById(req.params._id);
        if(!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        let existingWatch = retailer.watchObjects.find(retailerWatch => retailerWatch.watch.referenceNumber === watch.referenceNumber);
        if(!existingWatch)
            return res.json(Response.error({en: 'Watch is not present in retailer\'s stock watches.'}));

        retailer.watchObjects.pull({"_id" : existingWatch._id});

        await retailer.save();

        return res.json(Response.payload({payload: retailer}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.UpdateRetailerWatchDiscount = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true, enforcePayload: true});

        let retailerWatchDiscount =  Request.validateDiscount(req.body.payload.retailerWatchDiscount, 'retailerWatchDiscount', {optional: false});

        let retailer = await Retailer.findById(req.user._id).populate('watchObjects.watch');
        if(!retailer)
            return done({en: 'This Retailer is not registered', errorType: ErrorType.UNAUTHORIZED});

        let watch = await Watch.findById(req.params._id);
        if(!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        let existingWatch = retailer.watchObjects.find(retailerWatch => retailerWatch.watch.referenceNumber === watch.referenceNumber);
        if(!existingWatch)
            return res.json(Response.error({en: 'Watch is not present in retailer\'s stock watches.'}));

        existingWatch.retailerWatchDiscount = retailerWatchDiscount;

        await retailer.save();

        return res.json(Response.payload({payload: retailer}));
    }
    catch(error)
    {
        next(error);
    }
};