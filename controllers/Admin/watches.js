const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const Watch = require('../../database/models/Watch');

module.exports.create = async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let watch = new Watch();

        watch.brand = Request.validateText(req.body.payload.brand, 'brand');
        watch.model = Request.validateText(req.body.payload.model, 'model');
        watch.referenceNumber = Request.validateText(req.body.payload.referenceNumber, 'referenceNumber');
        watch.gender = Request.validateText(req.body.payload.gender, 'gender', {optional: true});
        watch.limited = Request.validateText(req.body.payload.limited, 'limited', {optional: true});
        watch.awards = Request.validateText(req.body.payload.awards, 'awards', {optional: true});

        watch.movementCaliberName = Request.validateText(req.body.payload.movementCaliberName, 'movementCaliberName');
        watch.movementAutomaticOrManual = Request.validateText(req.body.payload.movementAutomaticOrManual, 'movementAutomaticOrManual', {optional: true});
        watch.movementCaliberNumber = Request.validateText(req.body.payload.movementCaliberNumber, 'movementCaliberNumber');
        watch.movementDiameter = Request.validateText(req.body.payload.movementDiameter, 'movementDiameter');
        watch.movementHeight = Request.validateText(req.body.payload.movementHeight, 'movementHeight');
        watch.movementJewels = Request.validateText(req.body.payload.movementJewels, 'movementJewels');
        watch.movementFrequency = Request.validateText(req.body.payload.movementFrequency, 'movementFrequency');
        watch.movementPowerReserve = Request.validateText(req.body.payload.movementPowerReserve, 'movementPowerReserve');
        watch.movementCertificate = Request.validateText(req.body.payload.movementCertificate, 'movementCertificate', {optional: true});
        watch.movementDecoration = Request.validateText(req.body.payload.movementDecoration, 'movementDecoration', {optional: true});
        watch.movementSpring = Request.validateText(req.body.payload.movementSpring, 'movementSpring', {optional: true});
        watch.movementTourbillon = Request.validateText(req.body.payload.movementTourbillon, 'movementTourbillon', {optional: true});
        watch.movementRotor = Request.validateText(req.body.payload.movementRotor, 'movementRotor', {optional: true});
        watch.movementAdditionalFeatures = Request.validateTextObjects(req.body.payload.movementAdditionalFeatures, 'movementAdditionalFeatures', {optional: true});

        watch.functions = Request.validateTextObjects(req.body.payload.functions, 'functions');

        watch.caseMaterial = Request.validateText(req.body.payload.caseMaterial, 'caseMaterial');
        watch.caseDiameter = Request.validateText(req.body.payload.caseDiameter, 'caseDiameter');
        watch.caseHeight = Request.validateText(req.body.payload.caseHeight, 'caseHeight');
        watch.caseFront = Request.validateText(req.body.payload.caseFront, 'caseFront');
        watch.caseBack = Request.validateText(req.body.payload.caseBack, 'caseBack');
        watch.waterResistance = Request.validateText(req.body.payload.waterResistance, 'waterResistance', {optional: true});
        watch.caseCrown = Request.validateText(req.body.payload.caseCrown, 'caseCrown', {optional: true});
        watch.caseAdditionalFeatures = Request.validateTextObjects(req.body.payload.caseAdditionalFeatures, 'caseAdditionalFeatures', {optional: true});

        watch.dialColour = Request.validateText(req.body.payload.dialColour, 'dialColour');
        watch.dialIndex = Request.validateText(req.body.payload.dialIndex, 'dialIndex');
        watch.dialFinish = Request.validateText(req.body.payload.dialFinish, 'dialFinish', {optional: true});
        watch.dialHands = Request.validateText(req.body.payload.dialHands, 'dialHands');
        watch.dialAdditionalFeatures = Request.validateTextObjects(req.body.payload.dialAdditionalFeatures, 'dialAdditionalFeatures', {optional: true});

        watch.band = Request.validateText(req.body.payload.band, 'band');
        watch.bandMaterial = Request.validateText(req.body.payload.bandMaterial, 'bandMaterial');
        watch.bandClasp = Request.validateText(req.body.payload.bandClasp, 'bandClasp');
        watch.bandColour = Request.validateText(req.body.payload.bandColour, 'bandColour');
        watch.bandClaspMaterial = Request.validateText(req.body.payload.bandClaspMaterial, 'bandClaspMaterial');
        watch.bandAdditionalFeatures = Request.validateTextObjects(req.body.payload.bandAdditionalFeatures, 'bandAdditionalFeatures', {optional: true});

        watch.price = Request.validateNumber(req.body.payload.price, 'price');
        watch.priceCurrency = Request.validateText(req.body.payload.priceCurrency, 'priceCurrency');

        watch.mainPhotoUrl = Request.validateS3Url(req.body.payload.mainPhotoUrl, 'mainPhotoUrl');
        watch.banner1PhotoUrl = Request.validateS3Url(req.body.payload.banner1PhotoUrl, 'bannerPhotoUrl1', {optional: true});
        watch.banner2PhotoUrl = Request.validateS3Url(req.body.payload.banner2PhotoUrl, 'bannerPhotoUrl2', {optional: true});

        watch.section1Title = Request.validateText(req.body.payload.section1Title, 'section1Title', {optional: true});
        watch.section1Paragraph = Request.validateText(req.body.payload.section1Paragraph, 'section1Paragraph', {optional: true});
        watch.section1PhotoUrl = Request.validateS3Url(req.body.payload.section1PhotoUrl, 'section1PhotoUrl', {optional: true});

        watch.section2Title = Request.validateText(req.body.payload.section2Title, 'section2Title', {optional: true});
        watch.section2Paragraph = Request.validateText(req.body.payload.section2Paragraph, 'section2Paragraph', {optional: true});
        watch.section2PhotoUrl = Request.validateS3Url(req.body.payload.section2PhotoUrl, 'section2PhotoUrl', {optional: true});

        watch.section3Title = Request.validateText(req.body.payload.section3Title, 'section3Title', {optional: true});
        watch.section3Paragraph = Request.validateText(req.body.payload.section3Paragraph, 'section3Paragraph', {optional: true});
        watch.section3PhotoUrl = Request.validateS3Url(req.body.payload.section3PhotoUrl, 'section3PhotoUrl', {optional: true});

        watch.section4Title = Request.validateText(req.body.payload.section4Title, 'section4Title', {optional: true});
        watch.section4Paragraph = Request.validateText(req.body.payload.section4Paragraph, 'section4Paragraph', {optional: true});
        watch.section4PhotoUrl = Request.validateS3Url(req.body.payload.section4PhotoUrl, 'section4PhotoUrl', {optional: true});

        watch.section5Titles = Request.validateText(req.body.payload.section5Titles, 'section5Title', {optional: true});
        watch.section5Paragraphs = Request.validateText(req.body.payload.section5Paragraphs, 'section5Paragraph', {optional: true});
        watch.section5PhotoUrls = Request.validateS3UrlObjects(req.body.payload.section5PhotoUrls, 'section5PhotoUrls', {optional: true});

        watch.createdByAdmin = req.admin._id;
        watch.lastEditedByAdmin = req.admin._id;

        let savedWatch = await watch.save();

        let message = 'Watch ' + savedWatch.referenceNumber + ' created successfully.';
        return res.json(Response.payload({payload: savedWatch, en: message}));
    }
    catch (error)
    {
        next(error);
    }
};

module.exports.readAll = async function (req, res, next)
{
    try
    {
        let watches = await Watch.find({});

        return res.json(Response.payload({payload: watches}));
    }
    catch (error)
    {
        next(error);
    }
};

module.exports.readById = async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true});

        let watch = await Watch.findById(req.params._id);
        if (!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        return res.json(Response.payload({payload: watch}));
    }
    catch (error)
    {
        next(error);
    }
};
