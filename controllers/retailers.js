const Request = require('../models/reqres/Request');
const Response = require('../models/reqres/Response');
const Brand = require('../database/models/Brand');
const Collection = require('../database/models/Collection');
const Watch = require('../database/models/Watch');
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
        retailer.firstName = Request.validateName(req.body.payload.firstName, 'firstName', {optional: true});
        retailer.lastName = Request.validateName(req.body.payload.lastName, 'lastName', {optional: true});
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
        savedRetailer = savedRetailer.toJSON();

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
                .populate('watchObjects.watchObject')
                .populate('maximumBrandDiscounts.brandObject')
                .populate('maximumCollectionDiscounts.brandObject')
                .populate('maximumCollectionDiscounts.collectionObject')
                .populate('maximumWatchDiscounts.brandObject')
                .populate('maximumWatchDiscounts.collectionObject')
                .populate('maximumWatchDiscounts.watchObject');

            if(!retailer)
                return res.json(Response.error({en: 'No retailer is available with this Id.'}));

            return res.json(Response.payload({payload: retailer}));
        }
        else
        {
            let retailer = await Retailer.findOne({email: req.params._id})
                .populate('watchObjects.watchObject')
                .populate('maximumBrandDiscounts.brandObject')
                .populate('maximumCollectionDiscounts.brandObject')
                .populate('maximumCollectionDiscounts.collectionObject')
                .populate('maximumWatchDiscounts.brandObject')
                .populate('maximumWatchDiscounts.collectionObject')
                .populate('maximumWatchDiscounts.watchObject');

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
            .populate('watchObjects.watchObject')
            .populate('maximumBrandDiscounts.brandObject')
            .populate('maximumCollectionDiscounts.brandObject')
            .populate('maximumCollectionDiscounts.collectionObject')
            .populate('maximumWatchDiscounts.brandObject')
            .populate('maximumWatchDiscounts.collectionObject')
            .populate('maximumWatchDiscounts.watchObject');

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

        let firstName = Request.validateName(req.body.payload.firstName, 'firstName', {optional: true});
        if(firstName)
        {
            retailer.firstName = firstName;
            retailer.markModified('firstName');
        }

        let lastName = Request.validateName(req.body.payload.lastName, 'lastName', {optional: true});
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

        retailer.lastEditedByAdminObject = req.user._id;
        retailer.markModified('lastEditedByAdminObject');

        let savedRetailer = await retailer.save();
        savedRetailer = savedRetailer.toJSON();

        return res.json(Response.payload({payload: savedRetailer, en: 'Successfully updated retailer: ' + retailer.email}));
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

module.exports.addOrUpdateRetailerMaximumBrandDiscount = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true, enforcePayload: true});

        let retailer = await Retailer.findById(req.params._id).populate('maximumBrandDiscounts.brandObject');
        if(!retailer)
            return res.json(Response.error({en: 'No retailer is available with this id.'}));

        let brandObject = Request.validateIdOrObject(req.body.payload.brandObject, 'brandObject', {optional: false});

        let brand = await Brand.findById(brandObject);
        if(!brand)
            return res.json(Response.error({en: 'No brand is available with this brand id.'}));

        let action;

        let existingMaximumBrandDiscountObject = retailer.maximumBrandDiscounts.find(retailerMaximumBrandDiscountObject => (retailerMaximumBrandDiscountObject.brandObject && retailerMaximumBrandDiscountObject.brandObject._id.equals(brand._id)));
        if(existingMaximumBrandDiscountObject)
        {
            let maximumBrandDiscount = Request.validatePercentage(req.body.payload.maximumBrandDiscount, 'maximumBrandDiscount', {optional: true});
            if(maximumBrandDiscount === null)
            {
                retailer.maximumBrandDiscounts.pull({_id: existingMaximumBrandDiscountObject._id});
                action = "deleted";
            }
            else
            {
                existingMaximumBrandDiscountObject.maximumBrandDiscount = maximumBrandDiscount;
                action = "updated";
            }
        }
        else
        {
            let maximumBrandDiscount = Request.validatePercentage(req.body.payload.maximumBrandDiscount, 'maximumBrandDiscount', {optional: false});

            retailer.maximumBrandDiscounts.addToSet({brandObject: brand, maximumBrandDiscount: maximumBrandDiscount});
            action = "added";
        }

        retailer.markModified('maximumBrandDiscounts');

        retailer.lastEditedByAdminObject = req.user._id;
        retailer.markModified('lastEditedByAdminObject');

        let savedRetailer = await retailer.save();
        savedRetailer = savedRetailer.toJSON();

        return res.json(Response.payload({payload: savedRetailer, en: 'Successfully ' + action + ' the maximum discount on brand ' + brand.name + ' for retailer: ' + retailer.email}));

    }
    catch(error)
    {
        next(error);
    }
};

module.exports.addOrUpdateRetailerMaximumCollectionDiscount = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true, enforcePayload: true});

        let retailer = await Retailer.findById(req.params._id).populate('maximumCollectionDiscounts.collectionObject');
        if(!retailer)
            return res.json(Response.error({en: 'No retailer is available with this id.'}));

        let collectionObject = Request.validateIdOrObject(req.body.payload.collectionObject, 'collectionObject', {optional: false});

        let collection = await Collection.findById(collectionObject);
        if(!collection)
            return res.json(Response.error({en: 'No collection is available with the collection Id.'}));

        let brand = await Brand.findById(collection.brandObject);
        if(!brand)
            return res.json(Response.error({en: 'No brand is available for this collection Id.'}));

        let action;

        let existingMaximumCollectionDiscountObject = retailer.maximumCollectionDiscounts.find(retailerMaximumCollectionDiscountObject => (retailerMaximumCollectionDiscountObject.collectionObject && retailerMaximumCollectionDiscountObject.collectionObject._id.equals(collection._id)));
        if(existingMaximumCollectionDiscountObject)
        {
            let maximumCollectionDiscount = Request.validatePercentage(req.body.payload.maximumCollectionDiscount, 'maximumCollectionDiscount', {optional: true});
            if(maximumCollectionDiscount === null)
            {
                retailer.maximumCollectionDiscounts.pull({_id: existingMaximumCollectionDiscountObject._id});
                action = "deleted";
            }
            else
            {
                existingMaximumCollectionDiscountObject.maximumCollectionDiscount = maximumCollectionDiscount;
                action = "updated";
            }

        }
        else
        {
            let maximumCollectionDiscount = Request.validatePercentage(req.body.payload.maximumCollectionDiscount, 'maximumCollectionDiscount', {optional: false});

            retailer.maximumCollectionDiscounts.addToSet({brandObject: brand, collectionObject: collection, maximumCollectionDiscount: maximumCollectionDiscount});
            action = "added";
        }

        retailer.markModified('maximumCollectionDiscounts');

        retailer.lastEditedByAdminObject = req.user._id;
        retailer.markModified('lastEditedByAdminObject');

        let savedRetailer = await retailer.save();
        savedRetailer = savedRetailer.toJSON();

        return res.json(Response.payload({payload: savedRetailer, en: 'Successfully ' + action + ' the maximum discount on collection ' + collection.name + ' for retailer: ' + retailer.email}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.addOrUpdateRetailerMaximumWatchDiscount = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true, enforcePayload: true});

        let retailer = await Retailer.findById(req.params._id).populate('maximumWatchDiscounts.watchObject');
        if(!retailer)
            return res.json(Response.error({en: 'No retailer is available with this id.'}));

        let watchObject = Request.validateIdOrObject(req.body.payload.watchObject, 'watchObject', {optional: false});

        let watch = await Watch.findById(watchObject);
        if(!watch)
            return res.json(Response.error({en: 'No watch is available with the watch Id.'}));

        let brand = await Brand.findById(watch.brandObject);
        if(!brand)
            return res.json(Response.error({en: 'No brand is available for this watch Id.'}));

        let collection = await Collection.findById(watch.collectionObject);
        if(!collection)
            return res.json(Response.error({en: 'No collection is available for this watch Id.'}));

        let action;

        let existingMaximumWatchDiscountObject = retailer.maximumWatchDiscounts.find(retailerMaximumWatchDiscountObject => (retailerMaximumWatchDiscountObject.watchObject && retailerMaximumWatchDiscountObject.watchObject._id.equals(watch._id)));
        if(existingMaximumWatchDiscountObject)
        {
            let maximumWatchDiscount = Request.validatePercentage(req.body.payload.maximumWatchDiscount, 'maximumWatchDiscount', {optional: true});
            if(maximumWatchDiscount === null)
            {
                retailer.maximumWatchDiscounts.pull({_id: existingMaximumWatchDiscountObject._id});
                action = "deleted";
            }
            else
            {
                existingMaximumWatchDiscountObject.maximumWatchDiscount = maximumWatchDiscount;
                action = "updated";
            }
        }
        else
        {
            let maximumWatchDiscount = Request.validatePercentage(req.body.payload.maximumWatchDiscount, 'maximumWatchDiscount', {optional: false});

            retailer.maximumWatchDiscounts.addToSet({brandObject: brand, collectionObject: collection, watchObject: watch, maximumWatchDiscount: maximumWatchDiscount});
            action = "added";
        }

        retailer.markModified('maximumWatchDiscounts');

        retailer.lastEditedByAdminObject = req.user._id;
        retailer.markModified('lastEditedByAdminObject');

        let savedRetailer = await retailer.save();
        savedRetailer = savedRetailer.toJSON();

        return res.json(Response.payload({payload: savedRetailer, en: 'Successfully ' + action + ' a maximum discount on watch ' + watch.referenceNumber + ' for retailer: ' + retailer.email}));
    }
    catch(error)
    {
        next(error);
    }
};
