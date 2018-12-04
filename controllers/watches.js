const Request = require('../models/reqres/Request');
const Response = require('../models/reqres/Response');
const Brand = require('../database/models/Brand');
const Collection = require('../database/models/Collection');
const Watch = require('../database/models/Watch');

module.exports.create = async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let watch = new Watch();

        watch.brandObject = Request.validateId(req.body.payload.brandObject, 'brandObject');
        watch.model = Request.validateText(req.body.payload.model, 'model', {optional: true});
        watch.referenceNumber = Request.validateText(req.body.payload.referenceNumber, 'referenceNumber');
        watch.gender = Request.validateText(req.body.payload.gender, 'gender', {optional: true});
        watch.productionYear = Request.validateText(req.body.payload.productionYear, 'productionYear', {optional: true});
        watch.limited = Request.validateText(req.body.payload.limited, 'limited', {optional: true});
        watch.awards = Request.validateText(req.body.payload.awards, 'awards', {optional: true});
        watch.perpetual = Request.validateText(req.body.payload.perpetual, 'perpetual', {optional: true});

        watch.movementCaliberName = Request.validateText(req.body.payload.movementCaliberName, 'movementCaliberName', {optional: true});
        watch.movementAutomaticOrManual = Request.validateText(req.body.payload.movementAutomaticOrManual, 'movementAutomaticOrManual', {optional: true});
        watch.movementCaliberNumber = Request.validateText(req.body.payload.movementCaliberNumber, 'movementCaliberNumber', {optional: true});
        watch.movementDiameter = Request.validateText(req.body.payload.movementDiameter, 'movementDiameter', {optional: true});
        watch.movementHeight = Request.validateText(req.body.payload.movementHeight, 'movementHeight', {optional: true});
        watch.movementJewels = Request.validateText(req.body.payload.movementJewels, 'movementJewels', {optional: true});
        watch.movementFrequency = Request.validateText(req.body.payload.movementFrequency, 'movementFrequency', {optional: true});
        watch.movementPowerReserve = Request.validateText(req.body.payload.movementPowerReserve, 'movementPowerReserve', {optional: true});
        watch.movementCertificate = Request.validateText(req.body.payload.movementCertificate, 'movementCertificate', {optional: true});
        watch.movementDecoration = Request.validateText(req.body.payload.movementDecoration, 'movementDecoration', {optional: true});
        watch.movementSpring = Request.validateText(req.body.payload.movementSpring, 'movementSpring', {optional: true});
        watch.movementTourbillon = Request.validateText(req.body.payload.movementTourbillon, 'movementTourbillon', {optional: true});
        watch.movementRotor = Request.validateText(req.body.payload.movementRotor, 'movementRotor', {optional: true});
        watch.movementAdditionalFeatures = Request.validateTextObjects(req.body.payload.movementAdditionalFeatures, 'movementAdditionalFeatures', {optional: true});

        watch.functions = Request.validateTextObjects(req.body.payload.functions, 'functions', {optional: true});

        watch.caseMaterial = Request.validateText(req.body.payload.caseMaterial, 'caseMaterial', {optional: true});
        watch.caseDiameter = Request.validateText(req.body.payload.caseDiameter, 'caseDiameter', {optional: true});
        watch.caseHeight = Request.validateText(req.body.payload.caseHeight, 'caseHeight', {optional: true});
        watch.caseFront = Request.validateText(req.body.payload.caseFront, 'caseFront', {optional: true});
        watch.caseBack = Request.validateText(req.body.payload.caseBack, 'caseBack', {optional: true});
        watch.caseBezelMaterial = Request.validateText(req.body.payload.caseBezelMaterial, 'caseBezelMaterial', {optional: true});
        watch.waterResistance = Request.validateText(req.body.payload.waterResistance, 'waterResistance', {optional: true});
        watch.caseCrown = Request.validateText(req.body.payload.caseCrown, 'caseCrown', {optional: true});
        watch.caseAdditionalFeatures = Request.validateTextObjects(req.body.payload.caseAdditionalFeatures, 'caseAdditionalFeatures', {optional: true});

        watch.dialColour = Request.validateText(req.body.payload.dialColour, 'dialColour', {optional: true});
        watch.dialIndex = Request.validateText(req.body.payload.dialIndex, 'dialIndex', {optional: true});
        watch.dialFinish = Request.validateText(req.body.payload.dialFinish, 'dialFinish', {optional: true});
        watch.dialHands = Request.validateText(req.body.payload.dialHands, 'dialHands', {optional: true});
        watch.dialAdditionalFeatures = Request.validateTextObjects(req.body.payload.dialAdditionalFeatures, 'dialAdditionalFeatures', {optional: true});

        watch.band = Request.validateText(req.body.payload.band, 'band', {optional: true});
        watch.bandMaterial = Request.validateText(req.body.payload.bandMaterial, 'bandMaterial', {optional: true});
        watch.bandClasp = Request.validateText(req.body.payload.bandClasp, 'bandClasp', {optional: true});
        watch.bandColour = Request.validateText(req.body.payload.bandColour, 'bandColour', {optional: true});
        watch.bandClaspMaterial = Request.validateText(req.body.payload.bandClaspMaterial, 'bandClaspMaterial', {optional: true});
        watch.bandAdditionalFeatures = Request.validateTextObjects(req.body.payload.bandAdditionalFeatures, 'bandAdditionalFeatures', {optional: true});

        watch.price = Request.validateNumber(req.body.payload.price, 'price', {optional: true});
        watch.priceCurrency = Request.validateText(req.body.payload.priceCurrency, 'priceCurrency', {optional: true});

        watch.mainPhotoUrl = Request.validateS3Url(req.body.payload.mainPhotoUrl, 'mainPhotoUrl', {optional: true});
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

        watch.collectionObject = Request.validateId(req.body.payload.collectionObject, 'collectionObject', {optional: true});

        if(!watch.collectionObject)
        {
            let brand = await Brand.findById(watch.brandObject).populate('collectionObjects');
            if (!brand)
                return res.json(Response.error({en: 'No brand is available with this Id.'}));

            let existingCollection = brand.collectionObjects.find(brandCollection => brandCollection.name === 'UNDEFINED');
            if(!existingCollection)
            {
                let collection = new Collection();

                collection.brandObject = Request.validateId(req.body.payload.brandObject, 'brandObject', {optional: false});
                collection.name = Request.validateText('UNDEFINED', 'name', {optional: false});
                collection.createdByAdminObject = req.admin._id;
                collection.lastEditedByAdminObject = req.admin._id;

                let savedCollection = await collection.save();

                brand = await Brand.findById(collection.brandObject).populate('collectionObjects');
                if (!brand)
                    return res.json(Response.error({en: 'No brand is available with this Id.'}));

                brand.collectionObjects.addToSet(savedCollection);
                await brand.save();

                watch.collectionObject = savedCollection._id;
            }
            else
            {
                watch.collectionObject = existingCollection._id;
            }
        }

        let collection = await Collection.findById(watch.collectionObject).populate('watchObjects');
        if (!collection)
            return res.json(Response.error({en: 'No collection is available with this Id.'}));
        let existingWatch = collection.watchObjects.find(collectionWatch => collectionWatch.referenceNumber === watch.referenceNumber);
        if (existingWatch)
            return res.json(Response.error({en: 'Watch already exists in this collection.'})); // This should never happen since the reference number will have already been rejected

        watch.createdByAdminObject = req.admin._id;
        watch.lastEditedByAdminObject = req.admin._id;

        let savedWatch = await watch.save();

        collection.watchObjects.addToSet(savedWatch);
        await collection.save();

        let message = 'Watch with reference number: ' + savedWatch.referenceNumber + ' is created successfully.';
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

        let watch = await Watch.findById(req.params._id).populate('brandObject').populate('collectionObject');
        if (!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        return res.json(Response.payload({payload: watch}));
    }
    catch (error)
    {
        next(error);
    }
};

module.exports.updateById = async function (req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true});

        let watch = await Watch.findById(req.params._id).populate('brandObject').populate('collectionObject');
        if (!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        return res.json(Response.payload({payload: watch}));
    }
    catch (error)
    {
        next(error);
    }
};

