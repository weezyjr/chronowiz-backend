const router = require('express').Router();
const passport = require('passport');

const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const random = require('../../tools/random');
const Admin = require('../../database/models/users/Admin');

router.post('/', async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let admin = new Admin();

        // Email
        admin.email = Request.validateUserEmail(req.body.payload.email);
        admin.isEmailVerified = false;
        admin.emailVerificationCode = random.getRandomInt(1000, 9999);

        // password
        admin.password = Request.validateUserPassword(req.body.payload.password);

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
    catch (error)
    {
        next(error);
    }
});

module.exports = router;