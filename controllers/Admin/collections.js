const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const Collection = require('../../database/models/Collection');
const Brand = require('../../database/models/Brand');

module.exports.create = async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let collection = new Collection();

        collection.brandObject = Request.validateId(req.body.payload.brandObject, 'brandObject', {optional: false});
        collection.name = Request.validateText(req.body.payload.name, 'name', {optional: false});
        collection.createdByAdminObject = req.admin._id;
        collection.lastEditedByAdminObject = req.admin._id;

        let brand = await Brand.findById(collection.brandObject).populate('collectionObjects');
        if (!brand)
            return res.json(Response.error({en: 'No brand is available with this Id.'}));
        let existingCollection = brand.collectionObjects.find(brandCollection => brandCollection.name === collection.name);
        if (existingCollection)
            return res.json(Response.error({en: 'Collection already exists in this brand.'}));

        let savedCollection = await collection.save();

        brand.collectionObjects.addToSet(savedCollection);
        await brand.save();

        let message = savedCollection.name + ' created successfully.';
        return res.json(Response.payload({payload: savedCollection, en: message}));

    }
    catch (error)
    {
        next(error);
    }
};

module.exports.readAll = async function (req, res, next)
{
    try
    {
        let collections = await Collection.find({});

        return res.json(Response.payload({payload: collections}));
    }
    catch (error)
    {
        next(error);
    }
};

module.exports.readById = async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true});

        let collection = await Collection.findById(req.params._id).populate('brandObject').populate('watchObjects');
        if (!collection)
            return res.json(Response.error({en: 'No collection is available with this Id.'}));

        return res.json(Response.payload({payload: collection}));
    }
    catch (error)
    {
        next(error);
    }
};
