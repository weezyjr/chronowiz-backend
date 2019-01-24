const Request = require('../models/reqres/Request');
const Response = require('../models/reqres/Response');
const Collection = require('../database/models/Collection');
const Brand = require('../database/models/Brand');

module.exports.create = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let collection = new Collection();

        collection.brandObject = Request.validateIdOrObject(req.body.payload.brandObject, 'brandObject', {optional: false});
        collection.name = Request.validateText(req.body.payload.name, 'name', {optional: false});

        collection.description = Request.validateText(req.body.payload.description, 'description', {optional: false});
        collection.maximumDiscount = Request.validatePercentage(req.body.payload.maximumDiscount, 'maximumDiscount', {optional: true});

        collection.createdByAdminObject = req.user._id;
        collection.lastEditedByAdminObject = req.user._id;

        let brand = await Brand.findById(collection.brandObject).populate('collectionObjects');
        if(!brand)
            return res.json(Response.error({en: 'No brand is available with this collection\'s brand Id.'}));
        let existingCollection = brand.collectionObjects.find(brandCollection => brandCollection.name === collection.name);
        if(existingCollection)
            return res.json(Response.error({en: 'Collection already exists in this brand.'}));

        let savedCollection = await collection.save();

        brand.collectionObjects.addToSet(savedCollection);
        await brand.save();

        let message = savedCollection.name + ' created successfully.';
        return res.json(Response.payload({payload: savedCollection, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.readAll = async function(req, res, next)
{
    try
    {
        let collections = await Collection.find({});

        await collections.sort(sortByNameKey);

        return res.json(Response.payload({payload: collections}));
    }
    catch(error)
    {
        next(error);
    }
};

function sortByNameKey(a, b)
{
    if(a.name < b.name)
        return -1;
    if(a.name > b.name)
        return 1;
    return 0;
}

module.exports.readById = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true});

        let collection = await Collection.findById(req.params._id).populate('brandObject').populate('watchObjects');
        if(!collection)
            return res.json(Response.error({en: 'No collection is available with this Id.'}));

        return res.json(Response.payload({payload: collection}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.updateById = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true, enforcePayload: true});

        let collection = await Collection.findById(req.params._id);
        if(!collection)
            return res.json(Response.error({en: 'No collection is available with this Id.'}));

        if(collection.isUndefined === true)
            return res.json(Response.error({en: 'Cannot edit the UNDEFINED Collection.'}));

        let brandObject = Request.validateIdOrObject(req.body.payload.brandObject, 'brandObject', {optional: true});

        if(brandObject && (brandObject.toString() !== collection.brandObject._id.toString()))
        {
            let oldBrand = await Brand.findById(collection.brandObject._id);
            if(!oldBrand)
                return res.json(Response.error({en: 'No brand is available with the existing Brand Id.'}));

            oldBrand.collectionObjects.pull({_id: collection._id});
            await oldBrand.save();

            let brand = await Brand.findById(brandObject).populate('collectionObjects'); //TODO FIX BUG HERE brand.collectionObjects is always empty even when there is a real value
            if(!brand)
                return res.json(Response.error({en: 'No brand is available with the new Brand Id.'}));

            let existingCollection = brand.collectionObjects.find(brandCollection => brandCollection.name === collection.name);
            if(existingCollection)
                return res.json(Response.error({en: 'Collection already exists in the new brand.'}));

            brand.collectionObjects.addToSet(collection);
            await brand.save();

            collection.brandObject = brandObject;
            collection.markModified('brandObject');
        }

        let name = Request.validateText(req.body.payload.name, 'name', {optional: true});
        if(name)
        {
            collection.name = name;
            collection.markModified('name');
        }

        let description = Request.validateText(req.body.payload.description, 'description', {optional: true});
        if(description)
        {
            collection.description = description;
            collection.markModified('description');
        }

        let maximumDiscount = Request.validatePercentage(req.body.payload.maximumDiscount, 'maximumDiscount', {optional: true});
        if(maximumDiscount && maximumDiscount !== collection.maximumDiscount)
        {
            collection.maximumDiscount = maximumDiscount;
            collection.markModified('maximumDiscount');
        }

        if(!collection.createdByAdminObject)
            collection.createdByAdminObject = req.user._id;

        collection.lastEditedByAdminObject = req.user._id;

        let savedCollection = await collection.save();

        let message = savedCollection.name + ' updated successfully.';
        return res.json(Response.payload({payload: savedCollection, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.deleteById = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true});

        let collection = await Collection.findById(req.params._id);
        if(!collection)
            return res.json(Response.error({en: 'No collection is available with this Id.'}));

        if(collection.isUndefined === true)
            return res.json(Response.error({en: 'Cannot delete the UNDEFINED Collection.'}));

        let brand = await Brand.findById(collection.brandObject._id);
        if(!brand)
            return res.json(Response.error({en: 'No brand is available with this collection\'s brand Id.'}));

        brand.collectionObjects.pull({_id: collection._id});
        await brand.save();

        await collection.remove();

        let message = collection.name + ' deleted successfully.';
        return res.json(Response.payload({payload: collection, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};
