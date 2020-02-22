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

        let brands = await searchBrands(query);

        let collections = await searchCollections(query);

        let watches = await searchWatches(query);

        let result =
            {
                brands: brands,
                collections: collections,
                watches: watches,
            };

        return res.json(Response.payload({payload: result}));
    }
    catch(error)
    {
        next(error);
    }
};

async function searchWatches(query)
{
    return new Promise(function(resolve, reject)
    {
        Watch.search(query, function(error, data)
        {
            if(error)
                return reject(error);

            return resolve(data);
        });
    });
}

async function searchCollections(query)
{
    return new Promise(function(resolve, reject)
    {
        Collection.search(query, function(error, data)
        {
            if(error)
                return reject(error);

            return resolve(data);
        });
    });
}

async function searchBrands(query)
{
    return new Promise(function(resolve, reject)
    {
        Brand.search(query, function(error, data)
        {
            if(error)
                return reject(error);

            return resolve(data);
        });
    });
}

module.exports.advancedSearch = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParams: true});

        let query = Request.validateText(req.params.query, 'query');

        let result = [];

        let brands = await searchBrands(query);

        for(let brand of brands)
        {
            let watchesByBrandId = await searchWatchesByBrandId(brand._id);
            result = result.concat(watchesByBrandId);
        }

        let collections = await searchCollections(query);

        for(let collection of collections)
        {
            let watchesByCollectionId = await searchWatchesByCollectionId(collection._id);
            result = result.concat(watchesByCollectionId);
        }

        let watches = await searchWatches(query);
        result = result.concat(watches);

        //TODO remove duplicates. Test by searching for Lange

        return res.json(Response.payload({payload: result}));
    }
    catch(error)
    {
        next(error);
    }
};

async function searchWatchesByBrandId(brandId)
{
    return await Watch.find({brandObject: brandId});
}

async function searchWatchesByCollectionId(collectionId)
{
    return await Watch.find({collectionObject: collectionId});
}


