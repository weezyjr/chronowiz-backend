/******* Require npm modules *******/
const dotenv = require('dotenv');
const express = require('express');

/******* Environment variables *******/
dotenv.config({path: '.env'});
process.env.CHRONOWIZ_APP_VERSION = require('./package.json').version;

/******* Import Mongoose Connection *******/
const mongooseConnection = require('./database/mongooseConnection');

/******* Import Models - errors *******/
const ValidationError = require('./models/errors/ValidationError');
const NotFoundError = require('./models/errors/NotFoundError');
const UnauthorizedError = require('./models/errors/UnauthorizedError');
const UnverifiedError = require('./models/errors/UnverifiedError');
const ErrorType = require('./models/errors/ErrorType');
const ErrorArgs = require('./models/errors/ErrorArgs');
const ActionType = require('./models/errors/ActionType');

/******* Import ReqRes Models *******/
const Request = require('./models/reqres/Request');
const Response = require('./models/reqres/Response');

/******* Import Tools *******/
const report = require('./tools/report.js');
const random = require('./tools/random.js');
const utils = require('./tools/utils');

/****** Setting up Express app *******/
const app = express();

const PORT = 3000;

const helmet = require('helmet');
const passport_jwt_strategy = require('./auth/passportStrategy');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const strongErrorHandler = require('strong-error-handler');
const RateLimit = require('express-rate-limit');

/******* Environment variables *******/
const isProduction = process.env.CHRONOWIZ_ENV === 'chronowiz-tst' || process.env.CHRONOWIZ_ENV === 'chronowiz-stg' || process.env.CHRONOWIZ_ENV === 'chronowiz-liv';

/******* LogDNA *******/
report.setup(process.env.CHRONOWIZ_APP_NAME, process.env.CHRONOWIZ_ENV, process.env.LOGDNA_KEY);
report.log({message: 'App Environment: ' + process.env.CHRONOWIZ_APP_NAME + ', isProduction: ' + isProduction + ', App version: ' + process.env.CHRONOWIZ_APP_VERSION});

/******* Setting up Express app *******/
app.use(helmet());
app.use(new RateLimit({
    windowMs: 60 * 1000,
    max: 30,
    delayMs: 0
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

/****** Setting up Passport *******/
app.use(passport.initialize({userProperty: 'user'}));
passport_jwt_strategy.setupPassport(passport, process.env.JWT_SECRET);

/******* Morgan Logger *******/
if (isProduction)
    app.use(morgan('combined'));
else
    app.use(morgan('dev'));

/******* Setting up the routes *******/
app.get('/version', function (req, res)
{
    res.send(Response.payload({debug: process.env.CHRONOWIZ_APP_NAME + ' ' + process.env.CHRONOWIZ_APP_VERSION}));
});

app.use('/health', require('express-healthcheck')());

app.use('/', require('./routes'));

app.get('/robots.txt', function (req, res)
{
    res.type('text/plain');
    return res.send('User-agent: *\nDisallow: /');
});

/******* Setting up Error handling *******/
// As a last resort, if route is not found, display 404 error
app.use(function (req, res, next)
{
    return res.status(404).json(Response.error({
        debug: 'Error 404 trying to access path: ' + req.headers.host + req.originalUrl,
        errorType: ErrorType.WRONG_REQUEST,
        actionType: ActionType.CONTACT_SUPPORT,
        request: req
    }));
});

app.use(function (err, req, res, next)
{
    return res.json(Response.error({error: err, request: req}));
});

app.use(strongErrorHandler(
    {
        debug: !isProduction,
        defaultType: 'json',
        log: true,
        negotiateContentType: false
    }
));


/******* Setting up Express app server *******/
app.listen(PORT, async function ()
{
    report.log({message: 'Express app listening on port: ' + PORT});

    /******* Connect via Mongoose to MongoDb *******/
    try
    {
        await mongooseConnection.connect(process.env.MONGODB_URL, process.env.CHRONOWIZ_ENV);
    }
    catch (error)
    {
        report.error({error});
        throw error;
    }
});