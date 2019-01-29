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

        let retailer = await Retailer.findById(req.user._id).populate('watchObjects.watchObject');
        if(!retailer)
            return res.json(Response.error({en: 'This Retailer is not registered', errorType: ErrorType.UNAUTHORIZED}));

        let watch = await Watch.findById(req.params._id);
        if(!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        let existingWatch = retailer.watchObjects.find(retailerWatch => (retailerWatch.watchObject && retailerWatch.watchObject.referenceNumber === watch.referenceNumber));
        if(existingWatch)
            return res.json(Response.error({en: 'Watch already exists in the retailer\'s stock watches.'}));

        retailer.watchObjects.addToSet({watchObject: watch, retailerWatchDiscount: 0});

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

        let retailer = await Retailer.findById(req.user._id).populate('watchObjects.watchObject');
        if(!retailer)
            return res.json(Response.error({en: 'This Retailer is not registered', errorType: ErrorType.UNAUTHORIZED}));

        let watch = await Watch.findById(req.params._id);
        if(!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        let existingWatch = retailer.watchObjects.find(retailerWatch => (retailerWatch.watchObject && retailerWatch.watchObject.referenceNumber === watch.referenceNumber));
        if(!existingWatch)
            return res.json(Response.error({en: 'Watch is not present in retailer\'s stock watches.'}));

        retailer.watchObjects.pull({_id: existingWatch._id});

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

        let retailerWatchDiscount = Request.validatePercentage(req.body.payload.retailerWatchDiscount, 'retailerWatchDiscount', {optional: false});

        let retailer = await Retailer.findById(req.user._id)
            .populate('watchObjects.watchObject')
            .populate('maximumBrandDiscounts.brandObject')
            .populate('maximumCollectionDiscounts.collectionObject')
            .populate('maximumWatchDiscounts.watchObject');

        if(!retailer)
            return res.json(Response.error({en: 'This Retailer is not registered', errorType: ErrorType.UNAUTHORIZED}));

        let watch = await Watch.findById(req.params._id).populate('brandObject').populate('collectionObject');
        if(!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        let existingWatch = retailer.watchObjects.find(retailerWatch => (retailerWatch.watchObject && (retailerWatch.watchObject.referenceNumber === watch.referenceNumber)));
        if(!existingWatch)
            return res.json(Response.error({en: 'Watch is not present in the retailer\'s stock watches.'}));

        const setRetailerWatchDiscount = async function()
        {
            existingWatch.retailerWatchDiscount = retailerWatchDiscount;
            await retailer.save();
            return res.json(Response.payload({payload: retailer, en: 'Successfully updated your retailer discount on watch with reference number: ' + watch.referenceNumber + ' to be ' + existingWatch.retailerWatchDiscount + '%'}));
        };

        let retailerMaximumWatchDiscount = retailer.maximumWatchDiscounts.find(retailerMaximumWatchDiscount => (retailerMaximumWatchDiscount.watchObject && retailerMaximumWatchDiscount.watchObject._id.equals(watch._id)));
        if(retailerMaximumWatchDiscount)
        {
            if(retailerMaximumWatchDiscount.maximumWatchDiscount >= retailerWatchDiscount)
                return await setRetailerWatchDiscount();
            else
                return res.json(Response.error({en: 'The maximum discount that can be applied on the watch with reference number ' + retailerMaximumWatchDiscount.watchObject.referenceNumber + ' for your retailer account ' + retailer.email + ' is ' + retailerMaximumWatchDiscount.maximumWatchDiscount + '%'}));
        }

        let retailerMaximumCollectionDiscount = retailer.maximumCollectionDiscounts.find(retailerMaximumCollectionDiscount => (retailerMaximumCollectionDiscount.collectionObject && watch.collectionObject && retailerMaximumCollectionDiscount.collectionObject._id.equals(watch.collectionObject._id)));
        if(retailerMaximumCollectionDiscount)
        {
            if(retailerMaximumCollectionDiscount.maximumCollectionDiscount >= retailerWatchDiscount)
                return await setRetailerWatchDiscount();
            else
                return res.json(Response.error({en: 'The maximum discount that can be applied on the collection ' + retailerMaximumCollectionDiscount.collectionObject.name + ' for your retailer account ' + retailer.email + ' is ' + retailerMaximumCollectionDiscount.maximumCollectionDiscount + '%'}));
        }

        let retailerMaximumBrandDiscount = retailer.maximumBrandDiscounts.find(retailerMaximumBrandDiscount => (retailerMaximumBrandDiscount.brandObject && watch.brandObject && retailerMaximumBrandDiscount.brandObject._id.equals(watch.brandObject._id)));
        if(retailerMaximumBrandDiscount)
        {
            if(retailerMaximumBrandDiscount.maximumBrandDiscount >= retailerWatchDiscount)
                return await setRetailerWatchDiscount();
            else
                return res.json(Response.error({en: 'The maximum discount that can be applied on the brand ' + retailerMaximumBrandDiscount.brandObject.name + ' for your retailer account ' + retailer.email + ' is ' + retailerMaximumBrandDiscount.maximumBrandDiscount + '%'}));
        }

        if(watch.maximumDiscount)
        {
            if(watch.maximumDiscount >= retailerWatchDiscount)
                return await setRetailerWatchDiscount();
            else
                return res.json(Response.error({en: 'The maximum discount that can be applied on the watch with reference number ' + watch.referenceNumber + ' is ' + watch.maximumDiscount + '%'}));
        }

        if(watch.collectionObject.maximumDiscount)
        {
            if(watch.collectionObject.maximumDiscount >= retailerWatchDiscount)
                return await setRetailerWatchDiscount();
            else
                return res.json(Response.error({en: 'The maximum discount that can be applied on the collection ' + watch.collectionObject.name + ' is ' + watch.collectionObject.maximumDiscount + '%'}));
        }

        if(watch.brandObject.maximumDiscount)
        {
            if(watch.brandObject.maximumDiscount >= retailerWatchDiscount)
                return await setRetailerWatchDiscount();
            else
                return res.json(Response.error({en: 'The maximum discount that can be applied on the brand ' + watch.brandObject.name + ' is ' + watch.brandObject.maximumDiscount + '%'}));
        }

        return await setRetailerWatchDiscount();
    }
    catch(error)
    {
        next(error);
    }
};
