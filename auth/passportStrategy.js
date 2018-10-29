const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const Admin = require('../database/models/users/Admin');
const report = require('../tools/report.js');
const ErrorType = require('../models/errors/ErrorType');

module.exports.setupPassport = function (passport, JWT_SECRET)
{
    let opts = {};

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = JWT_SECRET;

    // Consider including issuer and audience in the JWT
    // opts.issuer = 'accounts.examplesoft.com';
    // opts.audience = 'yoursite.net';

    // The below is the authentication strategy called every time passport.authenticate('jwt-admin') is used
    passport.use('jwt-admin', new JwtStrategy(opts, async function (jwt_payload, done)
    {
        try
        {
            let admin = await Admin.findById(jwt_payload._id);

            if (!admin)
                return done({en: 'This Admin is not registered', errorType: ErrorType.UNAUTHORIZED});

            return done(null, admin);
        }
        catch (error)
        {
            report.error({error});

            return done({en: 'This admin is not registered or not authorized', error, errorType: ErrorType.UNAUTHORIZED});
        }
    }));
};