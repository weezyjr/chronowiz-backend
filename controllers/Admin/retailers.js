const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const random = require('../../tools/random');
const Retailer = require('../../database/models/Retailer');
const validator = require('validator');

module.exports.create = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let retailer = new Retailer();

        // Email
        retailer.email = Request.validateEmail(req.body.payload.email);
        retailer.isEmailVerified = false;
        retailer.emailVerificationCode = random.getRandomInt(1000, 9999);

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

        retailer.createdByAdminObject = req.admin._id;
        retailer.lastEditedByAdminObject = req.admin._id;

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
            let retailer = await Retailer.findById(req.params._id).populate('watchObjects');
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
    //TODO

    try
    {
        Request.validateReq(req, {enforceParams: true});

        let retailer = await Retailer.findById(req.params._id).populate('watchObjects');
        if(!retailer)
            return res.json(Response.error({en: 'No retailer is available with this Id.'}));

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

        let retailer = await Retailer.findById(req.params._id).populate('watchObjects');
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

