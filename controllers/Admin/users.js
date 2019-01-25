const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const User = require('../../database/models/User');
const validator = require('validator');

module.exports.readAll = async function(req, res, next)
{
    try
    {
        let users = await User.find({});

        await users.sort(sortByEmail);

        return res.json(Response.payload({payload: users}));
    }
    catch(error)
    {
        next(error);
    }
};

function sortByEmail(a, b)
{
    if(a.email < b.email)
        return -1;
    if(a.email > b.email)
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
            let user = await User.findById(req.params._id).populate('orderObjects');
            if(!user)
                return res.json(Response.error({en: 'No user is available with this Id.'}));

            return res.json(Response.payload({payload: user}));
        }
        else
        {
            let user = await User.findOne({email: req.params._id}).populate('orderObjects');
            if(!user)
                return res.json(Response.error({en: 'No user is available with this email.'}));

            return res.json(Response.payload({payload: user}));
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

        let isUserUpdated = false;

        let user = await User.findById(req.params._id);
        if(!user)
            return res.json(Response.error({en: 'No user is available with this Id.'}));

        let email = Request.validateEmail(req.body.payload.email, {optional: true});
        if(email && email !== user.email)
        {
            user.email = email;
            user.markModified('email');
            isUserUpdated = true;
        }

        let password = Request.validatePassword(req.body.payload.password, {optional: true});
        if(password)
        {
            user.password = password;
            user.markModified('password');
            isUserUpdated = true;
        }

        let companyName = Request.validateText(req.body.payload.companyName, 'companyName', {optional: true});
        if(companyName && companyName !== user.companyName)
        {
            user.companyName = companyName;
            user.markModified('companyName');
            isUserUpdated = true;
        }

        let firstName = Request.validateName(req.body.payload.firstName, 'firstName', {optional: true});
        if(firstName && firstName !== user.firstName)
        {
            user.firstName = firstName;
            user.markModified('firstName');
            isUserUpdated = true;
        }

        let lastName = Request.validateName(req.body.payload.lastName, 'lastName', {optional: true});
        if(lastName && lastName !== user.lastName)
        {
            user.lastName = lastName;
            user.markModified('lastName');
            isUserUpdated = true;
        }

        let phoneNumber = Request.validateText(req.body.payload.phoneNumber, 'phoneNumber', {optional: true});
        if(phoneNumber && phoneNumber !== user.phoneNumber)
        {
            user.phoneNumber = phoneNumber;
            user.markModified('phoneNumber');
            isUserUpdated = true;
        }

        let billingCountry = Request.validateText(req.body.payload.billingCountry, 'billingCountry', {optional: true});
        if(billingCountry && billingCountry !== user.billingCountry)
        {
            user.billingCountry = billingCountry;
            user.markModified('billingCountry');
            isUserUpdated = true;
        }

        let billingState = Request.validateText(req.body.payload.billingState, 'billingState', {optional: true});
        if(billingState && billingState !== user.billingState)
        {
            user.billingState = billingState;
            user.markModified('billingState');
            isUserUpdated = true;
        }

        let billingCity = Request.validateText(req.body.payload.billingCity, 'billingCity', {optional: true});
        if(billingCity && billingCity !== user.billingCity)
        {
            user.billingCity = billingCity;
            user.markModified('billingCity');
            isUserUpdated = true;
        }

        let billingZip = Request.validateText(req.body.payload.billingZip, 'billingZip', {optional: true});
        if(billingZip && billingZip !== user.billingZip)
        {
            user.billingZip = billingZip;
            user.markModified('billingZip');
            isUserUpdated = true;
        }

        let billingAddress = Request.validateText(req.body.payload.billingAddress, 'billingAddress', {optional: true});
        if(billingAddress && billingAddress !== user.billingAddress)
        {
            user.billingAddress = billingAddress;
            user.markModified('billingAddress');
            isUserUpdated = true;
        }

        let shippingCountry = Request.validateText(req.body.payload.shippingCountry, 'shippingCountry', {optional: true});
        if(shippingCountry && shippingCountry !== user.shippingCountry)
        {
            user.shippingCountry = shippingCountry;
            user.markModified('shippingCountry');
            isUserUpdated = true;
        }

        let shippingState = Request.validateText(req.body.payload.shippingState, 'shippingState', {optional: true});
        if(shippingState && shippingState !== user.shippingState)
        {
            user.shippingState = shippingState;
            user.markModified('shippingState');
            isUserUpdated = true;
        }

        let shippingCity = Request.validateText(req.body.payload.shippingCity, 'shippingCity', {optional: true});
        if(shippingCity && shippingCity !== user.shippingCity)
        {
            user.shippingCity = shippingCity;
            user.markModified('shippingCity');
            isUserUpdated = true;
        }

        let shippingZip = Request.validateText(req.body.payload.shippingZip, 'shippingZip', {optional: true});
        if(shippingZip && shippingZip !== user.shippingZip)
        {
            user.shippingZip = shippingZip;
            user.markModified('shippingZip');
            isUserUpdated = true;
        }

        let shippingAddress = Request.validateText(req.body.payload.shippingAddress, 'shippingAddress', {optional: true});
        if(shippingAddress && shippingAddress !== user.shippingAddress)
        {
            user.shippingAddress = shippingAddress;
            user.markModified('shippingAddress');
            isUserUpdated = true;
        }

        if(isUserUpdated)
        {
            user.lastEditedByAdminObject = req.user._id;
            user.markModified('lastEditedByAdminObject');

            let savedUser = await user.save();
            savedUser = savedUser.toJSON();

            let message = 'User with email: ' + savedUser.email + ' updated successfully.';
            return res.json(Response.payload({payload: savedUser, en: message}));
        }
        else
        {
            let message = 'User with email: ' + user.email + ' was not updated.';
            return res.json(Response.payload({payload: user, en: message}));
        }
    }
    catch(error)
    {
        next(error);
    }
};
