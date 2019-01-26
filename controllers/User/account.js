const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const random = require('../../tools/random');
const User = require('../../database/models/User');
const ses = require('../../aws/ses');
const ErrorType = require('../../models/errors/ErrorType');
const ErrorArgs = require('../../models/errors/ErrorArgs');

module.exports.signup = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let user = new User();

        // Email
        user.email = Request.validateEmail(req.body.payload.email);

        // password
        user.password = Request.validatePassword(req.body.payload.password);

        // firstName
        user.firstName = Request.validateName(req.body.payload.firstName, 'firstName', {optional: true});

        // lastName
        user.lastName = Request.validateName(req.body.payload.lastName, 'lastName', {optional: true});

        let savedUser = await user.save();

        let jwt = await savedUser.generateJWT(process.env.JWT_SECRET);

        savedUser = savedUser.toJSON();
        savedUser.jwt = jwt;

        return res.json(Response.payload({payload: savedUser, en: 'Thank you for signing up with ChronoWiz.'}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.login = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        //Email
        let email = Request.validateEmail(req.body.payload.email);

        let user = await User.findOne({email});
        if(!user)
            return res.json(Response.error({en: 'This email is not registered, hence cannot login.', request: req}));

        //Password
        let password = req.body.payload.password;
        let isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect)
            return res.json(Response.error({en: 'Password does not match registered user', request: req}));

        let jwt = await user.generateJWT(process.env.JWT_SECRET);
        user = user.toJSON();
        user.jwt = jwt;

        return res.json(Response.payload({payload: user}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.profile = async function(req, res, next)
{
    try
    {
        Request.validateReq(req);

        let user = await User.findById(req.user._id).populate('orderObjects');

        if(!user)
            return res.json(Response.error({en: 'No user is available with this Id.'}));

        return res.json(Response.payload({payload: user}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.update = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let isUserUpdated = false;

        let user = await User.findById(req.user._id);
        if(!user)
            return res.json(Response.error({en: 'No user is available with this Id.'}));

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
            let savedUser = await user.save();

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

module.exports.resetPasswordSendEmail = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        //Email
        let email = Request.validateEmail(req.body.payload.email);

        let user = await User.findOne({email});
        if(!user)
            return res.json(Response.error({en: 'This email is not registered, hence cannot reset the password.', request: req}));

        user.recoveryEmailVerificationCode = random.getRandomInt(100000, 999999);

        let savedUser = await user.save();

        await ses.sendResetPasswordEmail(savedUser.email, savedUser.recoveryEmailVerificationCode);

        return res.json(Response.payload({}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.resetPasswordConfirmCode = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        // Email
        let email = Request.validateEmail(req.body.payload.email);

        let user = await User.findOne({email});
        if(!user)
            return res.json(Response.error({
                errorType: ErrorType.NOT_FOUND,
                args: [ErrorArgs.USER],
                request: req
            }));

        // Recovery Verification Code
        if(user.recoveryEmailVerificationCode === -1)
        {
            return res.json(Response.error({
                errorType: ErrorType.WRONG_INPUT,
                args: [ErrorArgs.VERIFICATION_CODE],
                request: req
            }));
        }
        let recoveryEmailVerificationCode = Request.validateVerificationCode(req.body.payload.recoveryEmailVerificationCode, 'email');
        if(user.recoveryEmailVerificationCode !== recoveryEmailVerificationCode)
        {
            user.recoveryEmailVerificationCode = -1;
            return res.json(Response.error({
                errorType: ErrorType.WRONG_INPUT,
                args: [ErrorArgs.VERIFICATION_CODE],
                request: req
            }));
        }

        let savedUser = await user.save();

        let jwt = await savedUser.generateJWT(process.env.JWT_SECRET);

        savedUser = savedUser.toJSON();
        savedUser.jwt = jwt;

        return res.json(Response.payload({
            payload: savedUser
        }));
    }
    catch(error)
    {
        console.error(error);
        next(error);
    }
};

module.exports.resetPasswordNewPassword = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        // Email
        let email = Request.validateEmail(req.body.payload.email);

        let user = await User.findById(req.user._id);
        if(!user)
            return res.json(Response.error({
                errorType: ErrorType.NOT_FOUND,
                args: [ErrorArgs.USER],
                request: req
            }));

        if(user.email !== email)
            return res.json(Response.error({
                errorType: ErrorType.WRONG_INPUT,
                args: [ErrorArgs.EMAIL],
                request: req
            }));

        // Verification Code
        let recoveryEmailVerificationCode = Request.validateVerificationCode(req.body.payload.recoveryEmailVerificationCode, 'email');
        if(user.recoveryEmailVerificationCode !== recoveryEmailVerificationCode)
            return res.json(Response.error({
                errorType: ErrorType.WRONG_INPUT,
                args: [ErrorArgs.VERIFICATION_CODE],
                request: req
            }));

        // New password
        user.password = Request.validatePassword(req.body.payload.password);

        let savedUser = await user.save();

        let jwt = await savedUser.generateJWT(process.env.JWT_SECRET);

        savedUser = savedUser.toJSON();
        savedUser.jwt = jwt;

        return res.json(Response.payload({payload: savedUser}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.contactus = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let name = Request.validateName(req.body.payload.name, 'name', {optional: false});
        let email = Request.validateText(req.body.payload.email, 'email', {optional: false});
        let phoneNumber = Request.validateText(req.body.payload.phoneNumber, 'phoneNumber', {optional: true});
        let message = Request.validateText(req.body.payload.message, 'message', {optional: false});

        let body =
            'User name: ' + name + '<br>' +
            'User email: ' + email + '<br>' +
            'User phoneNumber: ' + phoneNumber + '<br>' +
            'Message: ' + message;

        await ses.sendGenericMail(["fikak@chronowiz.com", "heiba@chronowiz.com"], "Contact Us message received from " + name, body);

        return res.json(Response.payload({en: 'Contact us message sent successfully.'}));
    }
    catch(error)
    {
        next(error);
    }
};
