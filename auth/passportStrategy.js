const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../database/models/users/User');
const Guest = require('../database/models/users/Guest');
const UserRole = require('../models/roles/UserRole');
const report = require('../tools/report.js');
const random = require('../tools/random.js');

const ErrorType = require('../models/errors/ErrorType');

module.exports.setupPassport = function (passport, JWT_SECRET)
{
    let opts = {};

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = JWT_SECRET;

    // Consider including issuer and audience in the JWT
    // opts.issuer = 'accounts.examplesoft.com';
    // opts.audience = 'yoursite.net';

    // The below is the authentication strategy called every time passport.authenticate('jwt-user-blocked') is used
    passport.use('jwt-user-blocked', new JwtStrategy(opts, async function (jwt_payload, done)
    {
        try
        {
            if (jwt_payload.role === UserRole.GUEST)
            {
                let guest = await Guest.findById(jwt_payload._id);

                if (!guest)
                    return done({en: 'This Guest Id is not registered', errorType: ErrorType.UNAUTHORIZED});

                if (guest.role !== UserRole.GUEST)
                    return done({en: 'This guest is not authorized', errorType: ErrorType.UNAUTHORIZED});

                return done(null, guest);
            }
            else
            {
                let user = await User.findById(jwt_payload._id);

                if (!user)
                    return done({en: 'This User is not registered', errorType: ErrorType.UNAUTHORIZED});

                if (user.role !== UserRole.USER
                    && user.role !== UserRole.PENDING
                    && user.role !== UserRole.BLOCKED)
                    return done({en: 'This User is not authorized', errorType: ErrorType.UNAUTHORIZED});

                return done(null, user);
            }
        }
        catch (error)
        {
            report.error({error});

            return done({en: 'This user is not registered or not authorized', error, errorType: ErrorType.UNAUTHORIZED});
        }
    }));

    // The below is the authentication strategy called every time passport.authenticate('jwt-user-guest') is used
    passport.use('jwt-user-guest', new JwtStrategy(opts, async function (jwt_payload, done)
    {
        //TODO FIX when _id is neither user nor guest
        try
        {
            if (jwt_payload.role === UserRole.GUEST)
            {
                let guest = await Guest.findById(jwt_payload._id);

                if (!guest)
                    return done({en: 'This Guest Id is not registered', errorType: ErrorType.UNAUTHORIZED});

                if (guest.role !== UserRole.GUEST)
                    return done({en: 'This guest is not authorized', errorType: ErrorType.UNAUTHORIZED});

                return done(null, guest);
            }
            else
            {
                let user = await User.findById(jwt_payload._id);

                if (!user)
                    return done({en: 'This User is not registered', errorType: ErrorType.UNAUTHORIZED});

                if (user.role !== UserRole.USER
                    && user.role !== UserRole.PENDING)
                    return done({en: 'This User is not authorized', errorType: ErrorType.UNAUTHORIZED});

                return done(null, user);
            }
        }
        catch (error)
        {
            report.error({error});

            return done({en: 'This user is not registered or not authorized', error, errorType: ErrorType.UNAUTHORIZED});
        }
    }));

    // The below is the authentication strategy called every time passport.authenticate('jwt-user-pending') is used
    passport.use('jwt-user-pending', new JwtStrategy(opts, async function (jwt_payload, done)
    {
        try
        {
            let user = await User.findById(jwt_payload._id);

            if (!user)
                return done({en: 'This User is not registered', errorType: ErrorType.UNAUTHORIZED});

            if (user.role !== UserRole.USER
                && user.role !== UserRole.PENDING)
                return done({en: 'This User is not authorized', errorType: ErrorType.UNAUTHORIZED});

            return done(null, user);
        }
        catch (error)
        {
            report.error({error});

            return done({en: 'This user is not registered or not authorized', error, errorType: ErrorType.UNAUTHORIZED});
        }
    }));

    // The below is the authentication strategy called every time passport.authenticate('jwt-user') is used
    passport.use('jwt-user', new JwtStrategy(opts, async function (jwt_payload, done)
    {
        try
        {
            let user = await User.findById(jwt_payload._id);

            if (!user)
                return done({en: 'This User is not registered', errorType: ErrorType.UNAUTHORIZED});

            if (user.role !== UserRole.USER)
                return done({en: 'This User is not authorized', errorType: ErrorType.UNAUTHORIZED});

            if (!user.isEmailVerified && !user.isMobileVerified)
                return done({en: 'This User is not verified. Please verify either your email or mobile used to sign up in order to continue.', errorType: ErrorType.UNAUTHORIZED});

            return done(null, user);
        }
        catch (error)
        {
            report.error({error});

            return done({en: 'This user is not registered or not authorized', error, errorType: ErrorType.UNAUTHORIZED});
        }
    }));
};