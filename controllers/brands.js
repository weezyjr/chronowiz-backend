const Request = require('../models/reqres/Request');
const Response = require('../models/reqres/Response');
const Brand = require('../database/models/Brand');
const Collection = require('../database/models/Collection');
const validator = require('validator');

module.exports.create = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let brand = new Brand();

        brand.name = Request.validateText(req.body.payload.name, 'name', {optional: false});

        brand.logoPhotoUrl = Request.validateS3Url(req.body.payload.logoPhotoUrl, 'logoPhotoUrl', {optional: false});
        brand.headerPhotoUrl = Request.validateS3Url(req.body.payload.headerPhotoUrl, 'headerPhotoUrl', {optional: true});
        brand.banner1PhotoUrl = Request.validateS3Url(req.body.payload.banner1PhotoUrl, 'banner1PhotoUrl', {optional: false});
        brand.banner2PhotoUrl = Request.validateS3Url(req.body.payload.banner2PhotoUrl, 'banner2PhotoUrl', {optional: false});

        brand.createdByAdminObject = req.admin._id;
        brand.lastEditedByAdminObject = req.admin._id;

        let savedBrand = await brand.save();

        let message = savedBrand.name + ' created successfully.';
        return res.json(Response.payload({payload: savedBrand, en: message}));
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
        let brands = await Brand.find({});

        return res.json(Response.payload({payload: brands}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.readByIdOrName = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParams: true});

        if(validator.isMongoId(req.params._id))
        {
            let brand = await Brand.findById(req.params._id).populate(
                {
                    path: 'collectionObjects',
                    populate:
                        {
                            path: 'watchObjects'
                        }
                });

            if(!brand)
                return res.json(Response.error({en: 'No brand is available with this Id.'}));

            return res.json(Response.payload({payload: brand}));
        }
        else
        {
            let brand = await Brand.findOne({name: req.params._id}).populate(
                {
                    path: 'collectionObjects',
                    populate:
                        {
                            path: 'watchObjects'
                        }
                });
            if(!brand)
                return res.json(Response.error({en: 'No brand is available with this Name.'}));

            return res.json(Response.payload({payload: brand}));
        }
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

        let brand = await Brand.findById(req.params._id);
        if(!brand)
            return res.json(Response.error({en: 'No brand is available with this Id.'}));

        let name = Request.validateText(req.body.payload.name, 'name', {optional: true});
        if(name)
        {
            brand.name = name;
            brand.markModified('name');
        }

        let logoPhotoUrl = Request.validateS3Url(req.body.payload.logoPhotoUrl, 'logoPhotoUrl', {optional: true});
        if(logoPhotoUrl)
        {
            brand.logoPhotoUrl = logoPhotoUrl;
            brand.markModified('logoPhotoUrl');
        }

        let headerPhotoUrl = Request.validateS3Url(req.body.payload.headerPhotoUrl, 'headerPhotoUrl', {optional: true});
        if(headerPhotoUrl)
        {
            brand.headerPhotoUrl = headerPhotoUrl;
            brand.markModified('headerPhotoUrl');
        }

        let banner1PhotoUrl = Request.validateS3Url(req.body.payload.banner1PhotoUrl, 'banner1PhotoUrl', {optional: true});
        if(banner1PhotoUrl)
        {
            brand.banner1PhotoUrl = banner1PhotoUrl;
            brand.markModified('banner1PhotoUrl');
        }

        let banner2PhotoUrl = Request.validateS3Url(req.body.payload.banner2PhotoUrl, 'banner2PhotoUrl', {optional: true});
        if(banner2PhotoUrl)
        {
            brand.banner2PhotoUrl = banner2PhotoUrl;
            brand.markModified('banner2PhotoUrl');
        }

        brand.lastEditedByAdminObject = req.admin._id;

        let savedBrand = await brand.save();

        let message = savedBrand.name + ' updated successfully.';
        return res.json(Response.payload({payload: savedBrand, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.deleteById = async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true});

        let brand = await Brand.findById(req.params._id);
        if (!brand)
            return res.json(Response.error({en: 'No brand is available with this Id.'}));

        await Collection.deleteMany({brandObject: brand._id});

        await brand.remove();

        let message = brand.name + ' deleted successfully.';
        return res.json(Response.payload({payload: brand, en: message}));
    }
    catch (error)
    {
        next(error);
    }
};
