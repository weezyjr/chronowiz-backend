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
        user.firstName = Request.validateText(req.body.payload.firstName, 'firstName', {optional: true});

        // lastName
        user.lastName = Request.validateText(req.body.payload.lastName, 'lastName', {optional: true});

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

        let user = await User.findById(req.user._id);
        if(!user)
            return res.json(Response.error({en: 'No user is available with this Id.'}));

        return res.json(Response.payload({payload: user}));
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