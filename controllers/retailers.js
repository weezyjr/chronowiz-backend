const Request = require('../models/reqres/Request');
const Response = require('../models/reqres/Response');
const random = require('../tools/random');
const Retailer = require('../database/models/Retailer');
const validator = require('validator');

module.exports.create = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let retailer = new Retailer();

        // Email
        retailer.email = Request.validateEmail(req.body.payload.email);

        // password
        retailer.password = Request.validatePassword(req.body.payload.password);

        retailer.companyName = Request.validateText(req.body.payload.companyName, 'companyName', {optional: true});
        retailer.firstName = Request.validateText(req.body.payload.firstName, 'firstName', {optional: true});
        retailer.lastName = Request.validateText(req.body.payload.lastName, 'lastName', {optional: true});
        retailer.address = Request.validateText(req.body.payload.address, 'address', {optional: true});
        retailer.city = Request.validateText(req.body.payload.city, 'city', {optional: true});
        retailer.country = Request.validateText(req.body.payload.country, 'country', {optional: true});
        retailer.poBox = Request.validateText(req.body.payload.poBox, 'poBox', {optional: true});
        retailer.phoneNumber = Request.validateText(req.body.payload.phoneNumber, 'phoneNumber', {optional: true});
        retailer.fax = Request.validateText(req.body.payload.fax, 'fax', {optional: true});
        retailer.mobileNumber = Request.validateText(req.body.payload.mobileNumber, 'mobileNumber', {optional: true});

        retailer.createdByAdminObject = req.user._id;
        retailer.lastEditedByAdminObject = req.user._id;

        let savedRetailer = await retailer.save();

        let jwt = await savedRetailer.generateJWT(process.env.JWT_SECRET);

        savedRetailer = savedRetailer.toJSON();
        savedRetailer.jwt = jwt;

        return res.json(Response.payload({payload: savedRetailer, en: 'Successfully signed up retailer: ' + retailer.email}));
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
        let retailers = await Retailer.find({});

        await retailers.sort(sortByCompany);

        return res.json(Response.payload({payload: retailers}));
    }
    catch(error)
    {
        next(error);
    }
};

function sortByCompany(a, b)
{
    if(a.companyName < b.companyName)
        return -1;
    if(a.companyName > b.companyName)
        return 1;
    return 0;
}

module.exports.readByIdOrEmail = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParams: true});

        if(validator.isMongoId(req.params._id))
        {
            let retailer = await Retailer.findById(req.params._id)
                .populate('watchObjects.watch')
                .populate('maximumBrandDiscounts.brand')
                .populate('maximumCollectionDiscounts.collection')
                .populate('maximumWatchDiscounts.watch');

            if(!retailer)
                return res.json(Response.error({en: 'No retailer is available with this Id.'}));

            return res.json(Response.payload({payload: retailer}));
        }
        else
        {
            let retailer = await Retailer.findOne({email: req.params._id}).populate('watchObjects');
            if(!retailer)
                return res.json(Response.error({en: 'No retailer is available with this email.'}));

            return res.json(Response.payload({payload: retailer}));
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

        let retailer = await Retailer.findById(req.params._id)
            .populate('watchObjects.watch')
            .populate('maximumBrandDiscounts.brand')
            .populate('maximumCollectionDiscounts.collection')
            .populate('maximumWatchDiscounts.watch');

        if(!retailer)
            return res.json(Response.error({en: 'No retailer is available with this Id.'}));

        let email = Request.validateEmail(req.body.payload.email, {optional: true});
        if(email && email !== retailer.email)
        {
            retailer.email = email;
            retailer.markModified('email');
        }

        let password = Request.validatePassword(req.body.payload.password, {optional: true});
        if(password)
        {
            retailer.password = password;
            retailer.markModified('password');
        }

        let companyName = Request.validateText(req.body.payload.companyName, 'companyName', {optional: true});
        if(companyName)
        {
            retailer.companyName = companyName;
            retailer.markModified('companyName');
        }

        let firstName = Request.validateText(req.body.payload.firstName, 'firstName', {optional: true});
        if(firstName)
        {
            retailer.firstName = firstName;
            retailer.markModified('firstName');
        }

        let lastName = Request.validateText(req.body.payload.lastName, 'lastName', {optional: true});
        if(lastName)
        {
            retailer.lastName = lastName;
            retailer.markModified('lastName');
        }

        let address = Request.validateText(req.body.payload.address, 'address', {optional: true});
        if(address)
        {
            retailer.address = address;
            retailer.markModified('address');
        }

        let city = Request.validateText(req.body.payload.city, 'city', {optional: true});
        if(city)
        {
            retailer.city = city;
            retailer.markModified('city');
        }

        let country = Request.validateText(req.body.payload.country, 'country', {optional: true});
        if(country)
        {
            retailer.country = country;
            retailer.markModified('country');
        }

        let poBox = Request.validateText(req.body.payload.poBox, 'poBox', {optional: true});
        if(poBox)
        {
            retailer.poBox = poBox;
            retailer.markModified('poBox');
        }

        let phoneNumber = Request.validateText(req.body.payload.phoneNumber, 'phoneNumber', {optional: true});
        if(phoneNumber)
        {
            retailer.phoneNumber = phoneNumber;
            retailer.markModified('phoneNumber');
        }

        let fax = Request.validateText(req.body.payload.fax, 'fax', {optional: true});
        if(fax)
        {
            retailer.fax = fax;
            retailer.markModified('fax');
        }

        let mobileNumber = Request.validateText(req.body.payload.mobileNumber, 'mobileNumber', {optional: true});
        if(mobileNumber)
        {
            retailer.mobileNumber = mobileNumber;
            retailer.markModified('mobileNumber');
        }

        return res.json(Response.payload({payload: retailer}));
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

        let retailer = await Retailer.findById(req.params._id);
        if(!retailer)
            return res.json(Response.error({en: 'No retailer is available with this Id.'}));

        await retailer.remove();

        let message = retailer.email + ' deleted successfully.';
        return res.json(Response.payload({payload: retailer, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.updateRetailerMaximumBrandDiscount = async function(req, res, next)
{
    //TODO admin would choose a specific retailer, and then choose a specific brand and add a maximum discount for that retailer on that brand

    try
    {
        Request.validateReq(req, {enforceParamsId: true, enforcePayload: true});

        let retailer = await Retailer.findById(req.params._id).populate('maximumBrandDiscounts.brand');

        if(!retailer)
            return res.json(Response.error({en: 'No retailer is available with this Id.'}));

        let brandObject = Request.validateIdOrObject(req.body.payload.brandObject, 'brandObject', {optional: false});


        if(brandObject)
        {
            let oldBrand = await Brand.findById(collection.brandObject._id);
            if(!oldBrand)
                return res.json(Response.error({en: 'No brand is available with the existing Brand Id.'}));
        }

        return res.json(Response.payload({payload: retailer}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.updateRetailerMaximumCollectionDiscount = async function(req, res, next)
{
    //TODO admin would choose a specific retailer, and then choose a specific collection and add a maximum discount for that retailer on that collection
};

module.exports.updateRetailerMaximumWatchDiscount = async function(req, res, next)
{
    //TODO admin would choose a specific retailer, and then choose a specific watch and add a maximum discount for that retailer on that watch
};