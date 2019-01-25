const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const random = require('../../tools/random');
const Admin = require('../../database/models/Admin');

module.exports.signup = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let admin = new Admin();

        // Email
        admin.email = Request.validateEmail(req.body.payload.email);

        // password
        admin.password = Request.validatePassword(req.body.payload.password);

        // firstName
        admin.firstName = Request.validateName(req.body.payload.firstName, 'firstName');

        // lastName
        admin.lastName = Request.validateName(req.body.payload.lastName, 'lastName');

        let savedAdmin = await admin.save();

        let jwt = await savedAdmin.generateJWT(process.env.JWT_SECRET);

        savedAdmin = savedAdmin.toJSON();
        savedAdmin.jwt = jwt;

        return res.json(Response.payload({payload: savedAdmin, en: 'Thank you for signing up with ChronoWiz.'}));
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

        let admin = await Admin.findOne({email});
        if(!admin)
            return res.json(Response.error({en: 'This email is not registered, hence cannot login.', request: req}));

        //Password
        let password = req.body.payload.password;
        let isPasswordCorrect = await admin.comparePassword(password);
        if(!isPasswordCorrect)
            return res.json(Response.error({en: 'Password does not match registered admin', request: req}));

        let jwt = await admin.generateJWT(process.env.JWT_SECRET);
        admin = admin.toJSON();
        admin.jwt = jwt;

        return res.json(Response.payload({payload: admin}));
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

        let admin = await Admin.findById(req.user._id);
        if(!admin)
            return res.json(Response.error({en: 'No admin is available with this Id.'}));

        return res.json(Response.payload({payload: admin}));
    }
    catch(error)
    {
        next(error);
    }
};
