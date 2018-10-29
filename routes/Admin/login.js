const router = require('express').Router();

const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');

const Admin = require('../../database/models/users/Admin');

router.post('/', async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        //Email
        let email = Request.validateUserEmail(req.body.payload.email);

        let admin = await Admin.findOne({email});
        if (!admin)
            return res.json(Response.error({en: 'This email is not registered, hence cannot login.', request: req}));

        //Password
        let password = req.body.payload.password;
        let isPasswordCorrect = await admin.comparePassword(password);
        if (!isPasswordCorrect)
            return res.json(Response.error({en: 'Password does not match registered admin', request: req}));

        let jwt = await admin.generateJWT(process.env.JWT_SECRET);
        admin = admin.toJSON();
        admin.jwt = jwt;

        return res.json(Response.payload({payload: admin}));
    }
    catch (error)
    {
        next(error);
    }
});

module.exports = router;