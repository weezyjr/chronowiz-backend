const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const Brand = require('../../database/models/Brand');

module.exports.create = async function (req, res, next)
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
    catch (error)
    {
        next(error);
    }
};

module.exports.readAll = async function (req, res, next)
{
    try
    {
        let brands = await Brand.find({}).populate('collectionObjects');

        return res.json(Response.payload({payload: brands}));
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

        let brand = await Brand.findById(req.params._id).populate('collectionObjects');
        if (!brand)
            return res.json(Response.error({en: 'No brand is available with this Id.'}));

        return res.json(Response.payload({payload: brand}));
    }
    catch (error)
    {
        next(error);
    }
};
