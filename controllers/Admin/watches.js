const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const Watch = require('../../database/models/application/Watch');

module.exports.create = async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let watch = new Watch();

        watch.brand = Request.validateName(req.body.payload.brand, 'brand');
        watch.model = Request.validateName(req.body.payload.model, 'model');
        watch.referenceNumber = Request.validateName(req.body.payload.referenceNumber, 'referenceNumber');
        watch.gender = Request.validateName(req.body.payload.gender, 'gender', {optional: true});
        watch.limited = Request.validateName(req.body.payload.limited, 'limited', {optional: true});

        watch.movementType = Request.validateName(req.body.payload.movementType, 'movementType');
        watch.movementCaliberType = Request.validateName(req.body.payload.movementCaliberType, 'movementCaliberType');
        watch.movementCaliberNumber = Request.validateName(req.body.payload.movementCaliberNumber, 'movementCaliberNumber');
        watch.movementDiameter = Request.validateName(req.body.payload.movementDiameter, 'movementDiameter');
        watch.movementHeight = Request.validateName(req.body.payload.movementHeight, 'movementHeight');
        watch.movementJewels = Request.validateName(req.body.payload.movementJewels, 'movementJewels');
        watch.movementFrequency = Request.validateName(req.body.payload.movementFrequency, 'movementFrequency');
        watch.movementPowerReserve = Request.validateName(req.body.payload.movementPowerReserve, 'movementPowerReserve');
        watch.movementCertificate = Request.validateName(req.body.payload.movementCertificate, 'movementCertificate', {optional: true});
        watch.movementCertificateType = Request.validateName(req.body.payload.movementCertificateType, 'movementCertificateType', {optional: true});
        watch.movementDecoration = Request.validateName(req.body.payload.movementDecoration, 'movementDecoration', {optional: true});
        watch.movementSpring = Request.validateName(req.body.payload.movementSpring, 'movementSpring', {optional: true});
        watch.movementTourbillon = Request.validateName(req.body.payload.movementTourbillon, 'movementTourbillon', {optional: true});
        watch.movementRotor = Request.validateName(req.body.payload.movementRotor, 'movementRotor', {optional: true});
        watch.movementAdditionalFeatures = Request.validateNames(req.body.payload.movementAdditionalFeatures, 'movementAdditionalFeatures', {optional: true});

        watch.functions = Request.validateNames(req.body.payload.functions, 'functions');

        watch.caseMaterial = Request.validateName(req.body.payload.caseMaterial, 'caseMaterial');
        watch.caseDiameter = Request.validateName(req.body.payload.caseDiameter, 'caseDiameter');
        watch.caseHeight = Request.validateName(req.body.payload.caseHeight, 'caseHeight');
        watch.caseFront = Request.validateName(req.body.payload.caseFront, 'caseFront');
        watch.caseBack = Request.validateName(req.body.payload.caseBack, 'caseBack');
        watch.waterResistance = Request.validateName(req.body.payload.waterResistance, 'waterResistance');
        watch.caseCrown = Request.validateName(req.body.payload.caseCrown, 'caseCrown');
        watch.caseAdditionalFeatures = Request.validateNames(req.body.payload.caseAdditionalFeatures, 'caseAdditionalFeatures', {optional: true});

        watch.dialColour = Request.validateName(req.body.payload.dialColour, 'dialColour');
        watch.dialIndex = Request.validateName(req.body.payload.dialIndex, 'dialIndex');
        watch.dialFinish = Request.validateName(req.body.payload.dialFinish, 'dialFinish', {optional: true});
        watch.dialHands = Request.validateName(req.body.payload.dialHands, 'dialHands');
        watch.dialAdditionalFeatures = Request.validateNames(req.body.payload.dialAdditionalFeatures, 'dialAdditionalFeatures', {optional: true});

        watch.band = Request.validateName(req.body.payload.band, 'band');
        watch.bandMaterial = Request.validateName(req.body.payload.bandMaterial, 'bandMaterial');
        watch.bandClasp = Request.validateName(req.body.payload.bandClasp, 'bandClasp');
        watch.bandColour = Request.validateName(req.body.payload.bandColour, 'bandColour');
        watch.bandClaspMaterial = Request.validateName(req.body.payload.bandClaspMaterial, 'bandClaspMaterial');
        watch.bandAdditionalFeatures = Request.validateNames(req.body.payload.bandAdditionalFeatures, 'bandAdditionalFeatures', {optional: true});

        watch.price = Request.validateName(req.body.payload.price, 'price');

        watch.mainPhotoUrl = Request.validateS3Url(req.body.payload.mainPhotoUrl, 'mainPhotoUrl');
        watch.bannerPhotoUrl1 = Request.validateS3Url(req.body.payload.bannerPhotoUrl1, 'bannerPhotoUrl1', {optional: true});
        watch.bannerPhotoUrl2 = Request.validateS3Url(req.body.payload.bannerPhotoUrl2, 'bannerPhotoUrl2', {optional: true});

        watch.section1Title = Request.validateName(req.body.payload.section1Title, 'section1Title', {optional: true});
        watch.section1Paragraph = Request.validateName(req.body.payload.section1Paragraph, 'section1Paragraph', {optional: true});
        watch.section1PhotoUrl = Request.validateS3Url(req.body.payload.section1PhotoUrl, 'section1PhotoUrl', {optional: true});

        watch.section2Title = Request.validateName(req.body.payload.section2Title, 'section2Title', {optional: true});
        watch.section2Paragraph = Request.validateName(req.body.payload.section2Paragraph, 'section2Paragraph', {optional: true});
        watch.section2PhotoUrl = Request.validateS3Url(req.body.payload.section2PhotoUrl, 'section2PhotoUrl', {optional: true});

        watch.section3Title = Request.validateName(req.body.payload.section3Title, 'section3Title', {optional: true});
        watch.section3Paragraph = Request.validateName(req.body.payload.section3Paragraph, 'section3Paragraph', {optional: true});
        watch.section3PhotoUrl = Request.validateS3Url(req.body.payload.section3PhotoUrl, 'section3PhotoUrl', {optional: true});

        watch.section4Title = Request.validateName(req.body.payload.section4Title, 'section4Title', {optional: true});
        watch.section4Paragraph = Request.validateName(req.body.payload.section4Paragraph, 'section4Paragraph', {optional: true});
        watch.section4PhotoUrl = Request.validateS3Url(req.body.payload.section4PhotoUrl, 'section4PhotoUrl', {optional: true});

        watch.section5Title = Request.validateName(req.body.payload.section5Title, 'section5Title', {optional: true});
        watch.section5Paragraph = Request.validateName(req.body.payload.section5Paragraph, 'section5Paragraph', {optional: true});
        watch.section5PhotoUrls = Request.validateS3Urls(req.body.payload.section5PhotoUrls, 'section5PhotoUrls', {optional: true});

        let savedWatch = await watch.save();

        let message = 'Watch ' + savedWatch.model + ' created.';
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
