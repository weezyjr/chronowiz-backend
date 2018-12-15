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

