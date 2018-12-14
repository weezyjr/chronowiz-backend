const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const random = require('../../tools/random');
const User = require('../../database/models/User');

module.exports.signup = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let user = new User();

        // Email
        user.email = Request.validateEmail(req.body.payload.email);
        user.isEmailVerified = false;
        user.emailVerificationCode = random.getRandomInt(1000, 9999);

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