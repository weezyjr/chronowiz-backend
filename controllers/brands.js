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
        brand.darkLogoPhotoUrl = Request.validateS3Url(req.body.payload.darkLogoPhotoUrl, 'darkLogoPhotoUrl', {optional: false});
        brand.headerPhotoUrl = Request.validateS3Url(req.body.payload.headerPhotoUrl, 'headerPhotoUrl', {optional: true});
        brand.banner1PhotoUrl = Request.validateS3Url(req.body.payload.banner1PhotoUrl, 'banner1PhotoUrl', {optional: false});
        brand.banner2PhotoUrl = Request.validateS3Url(req.body.payload.banner2PhotoUrl, 'banner2PhotoUrl', {optional: false});

        brand.maximumDiscount = Request.validatePercentage(req.body.payload.maximumDiscount, 'maximumDiscount', {optional: true});

        brand.headerBackgroundColor = Request.validateText(req.body.payload.headerBackgroundColor, 'headerBackgroundColor', {optional: true});
        brand.headerBackgroundOpacity = Request.validatePercentage(req.body.payload.headerBackgroundOpacity, 'headerBackgroundOpacity', {optional: true});
        brand.headerContentColor = Request.validateBoolean(req.body.payload.headerContentColor, 'headerContentColor', {optional: true});

        brand.pageBackgroundColor = Request.validateText(req.body.payload.pageBackgroundColor, 'pageBackgroundColor', {optional: true});
        brand.pageBackgroundOpacity = Request.validatePercentage(req.body.payload.pageBackgroundOpacity, 'pageBackgroundOpacity', {optional: true});
        brand.pageContentColor = Request.validateBoolean(req.body.payload.pageContentColor, 'pageContentColor', {optional: true});

        brand.createdByAdminObject = req.user._id;
        brand.lastEditedByAdminObject = req.user._id;

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

        await brands.sort(sortByNameKey);

        return res.json(Response.payload({payload: brands}));
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

        let name = Request.validateName(req.body.payload.name, 'name', {optional: true});
        if(name && brand.name !== name)
        {
            brand.name = name;
            brand.markModified('name');
        }

        let logoPhotoUrl = Request.validateS3Url(req.body.payload.logoPhotoUrl, 'logoPhotoUrl', {optional: true});
        if(logoPhotoUrl && brand.logoPhotoUrl !== logoPhotoUrl)
        {
            brand.logoPhotoUrl = logoPhotoUrl;
            brand.markModified('logoPhotoUrl');
        }

        let darkLogoPhotoUrl = Request.validateS3Url(req.body.payload.darkLogoPhotoUrl, 'darkLogoPhotoUrl', {optional: true});
        if(darkLogoPhotoUrl && brand.darkLogoPhotoUrl !== darkLogoPhotoUrl)
        {
            brand.darkLogoPhotoUrl = darkLogoPhotoUrl;
            brand.markModified('darkLogoPhotoUrl');
        }

        let headerPhotoUrl = Request.validateS3Url(req.body.payload.headerPhotoUrl, 'headerPhotoUrl', {optional: true});
        if(headerPhotoUrl && brand.headerPhotoUrl !== headerPhotoUrl)
        {
            brand.headerPhotoUrl = headerPhotoUrl;
            brand.markModified('headerPhotoUrl');
        }

        let banner1PhotoUrl = Request.validateS3Url(req.body.payload.banner1PhotoUrl, 'banner1PhotoUrl', {optional: true});
        if(banner1PhotoUrl && brand.banner1PhotoUrl !== banner1PhotoUrl)
        {
            brand.banner1PhotoUrl = banner1PhotoUrl;
            brand.markModified('banner1PhotoUrl');
        }

        let banner2PhotoUrl = Request.validateS3Url(req.body.payload.banner2PhotoUrl, 'banner2PhotoUrl', {optional: true});
        if(banner2PhotoUrl && brand.banner2PhotoUrl !== banner2PhotoUrl)
        {
            brand.banner2PhotoUrl = banner2PhotoUrl;
            brand.markModified('banner2PhotoUrl');
        }

        let maximumDiscount = Request.validatePercentage(req.body.payload.maximumDiscount, 'maximumDiscount', {optional: true});
        if(maximumDiscount !== undefined && maximumDiscount !== brand.maximumDiscount)
        {
            brand.maximumDiscount = maximumDiscount;
            brand.markModified('maximumDiscount');
        }

        let headerBackgroundColor = Request.validateText(req.body.payload.headerBackgroundColor, 'headerBackgroundColor', {optional: true});
        if(headerBackgroundColor && brand.headerBackgroundColor !== headerBackgroundColor)
        {
            brand.headerBackgroundColor = headerBackgroundColor;
            brand.markModified('headerBackgroundColor');
        }

        let headerBackgroundOpacity = Request.validatePercentage(req.body.payload.headerBackgroundOpacity, 'headerBackgroundOpacity', {optional: true});
        if(headerBackgroundOpacity !== undefined && brand.headerBackgroundOpacity !== headerBackgroundColor)
        {
            brand.headerBackgroundOpacity = headerBackgroundOpacity;
            brand.markModified('headerBackgroundOpacity');
        }

        let headerContentColor = Request.validateBoolean(req.body.payload.headerContentColor, 'headerContentColor', {optional: true});
        if(headerContentColor && brand.headerContentColor !== headerContentColor)
        {
            brand.headerContentColor = headerContentColor;
            brand.markModified('headerContentColor');
        }

        let pageBackgroundColor = Request.validateText(req.body.payload.pageBackgroundColor, 'pageBackgroundColor', {optional: true});
        if(pageBackgroundColor && brand.pageBackgroundColor !== pageBackgroundColor)
        {
            brand.pageBackgroundColor = pageBackgroundColor;
            brand.markModified('pageBackgroundColor');
        }

        let pageBackgroundOpacity = Request.validatePercentage(req.body.payload.pageBackgroundOpacity, 'pageBackgroundOpacity', {optional: true});
        if(pageBackgroundOpacity !== undefined && brand.pageBackgroundOpacity !== pageBackgroundColor)
        {
            brand.pageBackgroundOpacity = pageBackgroundOpacity;
            brand.markModified('pageBackgroundOpacity');
        }

        let pageContentColor = Request.validateBoolean(req.body.payload.pageContentColor, 'pageContentColor', {optional: true});
        if(pageContentColor !== undefined && brand.pageContentColor !== pageContentColor)
        {
            brand.pageContentColor = pageContentColor;
            brand.markModified('pageContentColor');
        }

        if(!brand.createdByAdminObject)
            brand.createdByAdminObject = req.user._id;

        brand.lastEditedByAdminObject = req.user._id;

        let savedBrand = await brand.save();

        let message = savedBrand.name + ' updated successfully.';
        return res.json(Response.payload({payload: savedBrand, en: message}));
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

        let brand = await Brand.findById(req.params._id);
        if(!brand)
            return res.json(Response.error({en: 'No brand is available with this Id.'}));

        await Collection.deleteMany({brandObject: brand._id});

        await brand.remove();

        let message = brand.name + ' deleted successfully.';
        return res.json(Response.payload({payload: brand, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};
