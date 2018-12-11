const Request = require('../models/reqres/Request');
const Response = require('../models/reqres/Response');
const random = require('../tools/random');
const Retailer = require('../database/models/Retailer');

module.exports.login = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        //Email
        let email = Request.validateEmail(req.body.payload.email);

        let retailer = await Retailer.findOne({email});
        if(!retailer)
            return res.json(Response.error({en: 'This email is not registered, hence cannot login.', request: req}));

        //Password
        let password = req.body.payload.password;
        let isPasswordCorrect = await retailer.comparePassword(password);
        if(!isPasswordCorrect)
            return res.json(Response.error({en: 'Password does not match registered retailer', request: req}));

        let jwt = await retailer.generateJWT(process.env.JWT_SECRET);
        retailer = retailer.toJSON();
        retailer.jwt = jwt;

        return res.json(Response.payload({payload: retailer}));
    }
    catch(error)
    {
        next(error);
    }
};