const Request = require('../models/reqres/Request');
const Response = require('../models/reqres/Response');
const Brand = require('../database/models/Brand');
const Collection = require('../database/models/Collection');
const Watch = require('../database/models/Watch');
const Retailer = require('../database/models/Retailer');
const validator = require('validator');
const ErrorType = require('../models/errors/ErrorType');

module.exports.create = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let watch = new Watch();

        watch.brandObject = Request.validateIdOrObject(req.body.payload.brandObject, 'brandObject');
        watch.collectionObject = Request.validateIdOrObject(req.body.payload.collectionObject, 'collectionObject', {optional: true});
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
        watch.movementNumberOfParts = Request.validateNumber(req.body.payload.movementNumberOfParts, 'movementNumberOfParts', {optional: true});
        watch.movementAdditionalFeatures = Request.validateTextObjects(req.body.payload.movementAdditionalFeatures, 'movementAdditionalFeatures', {optional: true});

        watch.complications = Request.validateTextObjects(req.body.payload.complications, 'complications', {optional: true});

        watch.functions = Request.validateTextObjects(req.body.payload.functions, 'functions', {optional: true});

        watch.caseMaterial = Request.validateText(req.body.payload.caseMaterial, 'caseMaterial', {optional: true});
        watch.caseDiameter = Request.validateText(req.body.payload.caseDiameter, 'caseDiameter', {optional: true});
        watch.caseHeight = Request.validateText(req.body.payload.caseHeight, 'caseHeight', {optional: true});
        watch.caseFront = Request.validateText(req.body.payload.caseFront, 'caseFront', {optional: true});
        watch.caseBack = Request.validateText(req.body.payload.caseBack, 'caseBack', {optional: true});
        watch.caseBezelMaterial = Request.validateText(req.body.payload.caseBezelMaterial, 'caseBezelMaterial', {optional: true});
        watch.waterResistance = Request.validateText(req.body.payload.waterResistance, 'waterResistance', {optional: true});
        watch.waterProof = Request.validateText(req.body.payload.waterProof, 'waterProof', {optional: true});
        watch.caseCrown = Request.validateText(req.body.payload.caseCrown, 'caseCrown', {optional: true});
        watch.caseAdditionalFeatures = Request.validateTextObjects(req.body.payload.caseAdditionalFeatures, 'caseAdditionalFeatures', {optional: true});

        watch.dialColour = Request.validateText(req.body.payload.dialColour, 'dialColour', {optional: true});
        watch.dialIndex = Request.validateText(req.body.payload.dialIndex, 'dialIndex', {optional: true});
        watch.dialFinish = Request.validateText(req.body.payload.dialFinish, 'dialFinish', {optional: true});
        watch.dialType = Request.validateText(req.body.payload.dialType, 'dialType', {optional: true});
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
        watch.maximumDiscount = Request.validatePercentage(req.body.payload.maximumDiscount, 'maximumDiscount', {optional: true});

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

        if(!watch.collectionObject)
        {
            //Create Watch in Undefined Collection Object of watch.brandObject
            let brand = await Brand.findById(watch.brandObject).populate('collectionObjects');
            if(!brand)
                return res.json(Response.error({en: 'No brand is available with this watch\'s brand Id.'}));

            let existingCollection = brand.collectionObjects.find(brandCollection => brandCollection.isUndefined === true);
            if(!existingCollection)
            {
                let collection = new Collection();

                collection.brandObject = Request.validateIdOrObject(req.body.payload.brandObject, 'brandObject', {optional: false});
                collection.name = Request.validateText('UNDEFINED', 'name', {optional: false});
                collection.isUndefined = true;
                collection.createdByAdminObject = req.user._id;
                collection.lastEditedByAdminObject = req.user._id;

                let savedCollection = await collection.save();

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
        if(!collection)
            return res.json(Response.error({en: 'No collection is available with this Id.'}));
        let existingWatch = collection.watchObjects.find(collectionWatch => collectionWatch.referenceNumber === watch.referenceNumber);
        if(existingWatch)
            return res.json(Response.error({en: 'Watch already exists in this collection.'})); // This should never happen since the reference number will have already been rejected

        watch.createdByAdminObject = req.user._id;
        watch.lastEditedByAdminObject = req.user._id;

        let savedWatch = await watch.save();

        collection.watchObjects.addToSet(savedWatch);
        await collection.save();

        let message = 'Watch with reference number: ' + savedWatch.referenceNumber + ' is created successfully.';
        return res.json(Response.payload({payload: savedWatch, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.readAll = async function(req, res, next)
{
    try
    {
        let watches = await Watch.find({});

        await watches.sort(sortByRefKey);

        return res.json(Response.payload({payload: watches}));
    }
    catch(error)
    {
        next(error);
    }
};

function sortByRefKey(a, b)
{
    if(a.referenceNumber < b.referenceNumber)
        return -1;
    if(a.referenceNumber > b.referenceNumber)
        return 1;
    return 0;
}

module.exports.readByIdOrReference = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParams: true});

        if(validator.isMongoId(req.params._id))
        {
            let watch = await Watch.findById(req.params._id).populate('brandObject').populate('collectionObject');
            if(!watch)
                return res.json(Response.error({en: 'No watch is available with this Id.'}));

            return res.json(Response.payload({payload: watch}));
        }
        else
        {
            let watch = await Watch.findOne({referenceNumber: req.params._id}).populate('brandObject').populate('collectionObject');
            if(!watch)
                return res.json(Response.error({en: 'No watch is available with this Reference Number.'}));

            return res.json(Response.payload({payload: watch}));
        }
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.updateById = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true, enforcePayload: true});

        let watch = await Watch.findById(req.params._id).populate('brandObject').populate('collectionObject');
        if(!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        let isWatchUpdated = false;

        let newBrandId = Request.validateIdOrObject(req.body.payload.brandObject, 'brandObject', {optional: false});
        let newCollectionId = Request.validateIdOrObject(req.body.payload.collectionObject, 'collectionObject', {optional: true});

        let newCollection;

        if(newCollectionId)
        {
            newCollection = await Collection.findById(newCollectionId).populate('watchObjects');
            if(!newCollection)
                return res.json(Response.error({en: 'No collection is available with this Id.'}));
        }

        // Cases to update the brand
        if(
            (!watch.brandObject) ||
            (watch.brandObject._id.toString() !== newBrandId.toString())
        )
        {
            watch.brandObject = newBrandId;
            watch.markModified('brandObject');
            isWatchUpdated = true;
        }

        // Cases to delete watch from current collection
        if(watch.brandObject && watch.collectionObject &&
            (
                !(!watch.collectionObject.isUndefined && newCollectionId && !newCollection.isUndefined && (watch.brandObject._id.toString() === newBrandId.toString()) && (watch.collectionObject._id.toString() === newCollectionId.toString())) &&
                !(watch.collectionObject.isUndefined && !newCollectionId && watch.brandObject._id.toString() === newBrandId.toString()) &&
                !(watch.collectionObject.isUndefined && newCollectionId && newCollection.isUndefined && watch.brandObject._id.toString() === newBrandId.toString())
            ))
        {
            let collection = await Collection.findById(watch.collectionObject._id);
            if(!collection)
                return res.json(Response.error({en: 'No collection is available with the watch\'s collection Id.'}));

            collection.watchObjects.pull({_id: watch._id});
            await collection.save();
        }

        // Cases to add watch to defined or undefined collection
        if(
            !(watch.brandObject && watch.collectionObject && !watch.collectionObject.isUndefined && (watch.brandObject._id.toString() === newBrandId.toString()) && newCollectionId && !newCollection.isUndefined && (watch.collectionObject._id.toString() === newCollectionId.toString())) &&
            !(watch.brandObject && watch.collectionObject && watch.collectionObject.isUndefined && (watch.brandObject._id.toString() === newBrandId.toString()) && !newCollectionId && !newCollection) &&
            !(watch.brandObject && watch.collectionObject && watch.collectionObject.isUndefined && (watch.brandObject._id.toString() === newBrandId.toString()) && newCollectionId && newCollection.isUndefined)
        )
        {
            // Case to create watch in defined collection
            if(newCollectionId && newCollection && !newCollection.isUndefined)
            {
                watch.collectionObject = newCollectionId;
                watch.markModified('collectionObject');
            }
            else // Case to create watch in undefined collection of brandObject
            {
                let brand = await Brand.findById(newBrandId).populate('collectionObjects');
                if(!brand)
                    return res.json(Response.error({en: 'No brand is available with this watch\'s brand Id.'}));

                let existingCollection = brand.collectionObjects.find(brandCollection => brandCollection.isUndefined === true);
                if(!existingCollection)
                {
                    let collection = new Collection();

                    collection.brandObject = Request.validateIdOrObject(req.body.payload.brandObject, 'brandObject', {optional: false});
                    collection.name = Request.validateText('UNDEFINED', 'name', {optional: false});
                    collection.isUndefined = true;
                    collection.createdByAdminObject = req.user._id;
                    collection.lastEditedByAdminObject = req.user._id;

                    let savedCollection = await collection.save();

                    brand.collectionObjects.addToSet(savedCollection);
                    await brand.save();

                    watch.collectionObject = savedCollection._id;
                    watch.markModified('collectionObject');
                }
                else
                {
                    watch.collectionObject = existingCollection._id;
                    watch.markModified('collectionObject');
                }
            }

            let collectionToSaveTo = await Collection.findById(watch.collectionObject).populate('watchObjects');
            if(!collectionToSaveTo)
                return res.json(Response.error({en: 'No collection is available with the watch collectionObject Id.'}));
            let existingWatch = collectionToSaveTo.watchObjects.find(collectionWatch => collectionWatch.referenceNumber === watch.referenceNumber);
            if(existingWatch)
                return res.json(Response.error({en: 'Watch already exists in this collection.'}));

            if(!watch.createdByAdminObject)
                watch.createdByAdminObject = req.user._id;

            collectionToSaveTo.watchObjects.addToSet(watch);
            await collectionToSaveTo.save();

            isWatchUpdated = true;
        }

        let model = Request.validateText(req.body.payload.model, 'model', {optional: true});
        if(model && model !== watch.model)
        {
            watch.model = model;
            watch.markModified('model');
            isWatchUpdated = true;
        }

        let referenceNumber = Request.validateText(req.body.payload.referenceNumber, 'referenceNumber', {optional: true});
        if(referenceNumber && referenceNumber !== watch.referenceNumber)
        {
            watch.referenceNumber = referenceNumber;
            watch.markModified('referenceNumber');
            isWatchUpdated = true;
        }

        let gender = Request.validateText(req.body.payload.gender, 'gender', {optional: true});
        if(gender && gender !== watch.gender)
        {
            watch.gender = gender;
            watch.markModified('gender');
            isWatchUpdated = true;
        }

        let productionYear = Request.validateText(req.body.payload.productionYear, 'productionYear', {optional: true});
        if(productionYear && productionYear !== watch.productionYear)
        {
            watch.productionYear = productionYear;
            watch.markModified('productionYear');
            isWatchUpdated = true;
        }

        let limited = Request.validateText(req.body.payload.limited, 'limited', {optional: true});
        if(limited && limited !== watch.limited)
        {
            watch.limited = limited;
            watch.markModified('limited');
            isWatchUpdated = true;
        }

        let awards = Request.validateText(req.body.payload.awards, 'awards', {optional: true});
        if(awards && awards !== watch.awards)
        {
            watch.awards = awards;
            watch.markModified('awards');
            isWatchUpdated = true;
        }

        let perpetual = Request.validateText(req.body.payload.perpetual, 'perpetual', {optional: true});
        if(perpetual && perpetual !== watch.perpetual)
        {
            watch.perpetual = perpetual;
            watch.markModified('perpetual');
            isWatchUpdated = true;
        }

        let movementCaliberName = Request.validateText(req.body.payload.movementCaliberName, 'movementCaliberName', {optional: true});
        if(movementCaliberName && movementCaliberName !== watch.movementCaliberName)
        {
            watch.movementCaliberName = movementCaliberName;
            watch.markModified('movementCaliberName');
            isWatchUpdated = true;
        }

        let movementAutomaticOrManual = Request.validateText(req.body.payload.movementAutomaticOrManual, 'movementAutomaticOrManual', {optional: true});
        if(movementAutomaticOrManual && movementAutomaticOrManual !== watch.movementAutomaticOrManual)
        {
            watch.movementAutomaticOrManual = movementAutomaticOrManual;
            watch.markModified('movementAutomaticOrManual');
            isWatchUpdated = true;
        }

        let movementCaliberNumber = Request.validateText(req.body.payload.movementCaliberNumber, 'movementCaliberNumber', {optional: true});
        if(movementCaliberNumber && movementCaliberNumber !== watch.movementCaliberNumber)
        {
            watch.movementCaliberNumber = movementCaliberNumber;
            watch.markModified('movementCaliberNumber');
            isWatchUpdated = true;
        }

        let movementDiameter = Request.validateText(req.body.payload.movementDiameter, 'movementDiameter', {optional: true});
        if(movementDiameter && movementDiameter !== watch.movementDiameter)
        {
            watch.movementDiameter = movementDiameter;
            watch.markModified('movementDiameter');
            isWatchUpdated = true;
        }

        let movementHeight = Request.validateText(req.body.payload.movementHeight, 'movementHeight', {optional: true});
        if(movementHeight && movementHeight !== watch.movementHeight)
        {
            watch.movementHeight = movementHeight;
            watch.markModified('movementHeight');
            isWatchUpdated = true;
        }

        let movementJewels = Request.validateText(req.body.payload.movementJewels, 'movementJewels', {optional: true});
        if(movementJewels && movementJewels !== watch.movementJewels)
        {
            watch.movementJewels = movementJewels;
            watch.markModified('movementJewels');
            isWatchUpdated = true;
        }

        let movementFrequency = Request.validateText(req.body.payload.movementFrequency, 'movementFrequency', {optional: true});
        if(movementFrequency && movementFrequency !== watch.movementFrequency)
        {
            watch.movementFrequency = movementFrequency;
            watch.markModified('movementFrequency');
            isWatchUpdated = true;
        }

        let movementPowerReserve = Request.validateText(req.body.payload.movementPowerReserve, 'movementPowerReserve', {optional: true});
        if(movementPowerReserve && movementPowerReserve !== watch.movementPowerReserve)
        {
            watch.movementPowerReserve = movementPowerReserve;
            watch.markModified('movementPowerReserve');
            isWatchUpdated = true;
        }

        let movementCertificate = Request.validateText(req.body.payload.movementCertificate, 'movementCertificate', {optional: true});
        if(movementCertificate && movementCertificate !== watch.movementCertificate)
        {
            watch.movementCertificate = movementCertificate;
            watch.markModified('movementCertificate');
            isWatchUpdated = true;
        }

        let movementDecoration = Request.validateText(req.body.payload.movementDecoration, 'movementDecoration', {optional: true});
        if(movementDecoration && movementDecoration !== watch.movementDecoration)
        {
            watch.movementDecoration = movementDecoration;
            watch.markModified('movementDecoration');
            isWatchUpdated = true;
        }

        let movementSpring = Request.validateText(req.body.payload.movementSpring, 'movementSpring', {optional: true});
        if(movementSpring && movementSpring !== watch.movementSpring)
        {
            watch.movementSpring = movementSpring;
            watch.markModified('movementSpring');
            isWatchUpdated = true;
        }

        let movementTourbillon = Request.validateText(req.body.payload.movementTourbillon, 'movementTourbillon', {optional: true});
        if(movementTourbillon && movementTourbillon !== watch.movementTourbillon)
        {
            watch.movementTourbillon = movementTourbillon;
            watch.markModified('movementTourbillon');
            isWatchUpdated = true;
        }

        let movementRotor = Request.validateText(req.body.payload.movementRotor, 'movementRotor', {optional: true});
        if(movementRotor && movementRotor !== watch.movementRotor)
        {
            watch.movementRotor = movementRotor;
            watch.markModified('movementRotor');
            isWatchUpdated = true;
        }

        let movementNumberOfParts = Request.validateNumber(req.body.payload.movementNumberOfParts, 'movementNumberOfParts', {optional: true});
        if(movementNumberOfParts && movementNumberOfParts !== watch.movementNumberOfParts)
        {
            watch.movementNumberOfParts = movementNumberOfParts;
            watch.markModified('movementNumberOfParts');
            isWatchUpdated = true;
        }

        let movementAdditionalFeatures = Request.validateTextObjects(req.body.payload.movementAdditionalFeatures, 'movementAdditionalFeatures', {optional: true});
        if(movementAdditionalFeatures && movementAdditionalFeatures !== watch.movementAdditionalFeatures)
        {
            watch.movementAdditionalFeatures = movementAdditionalFeatures;
            watch.markModified('movementAdditionalFeatures');
            isWatchUpdated = true;
        }

        let complications = Request.validateTextObjects(req.body.payload.complications, 'complications', {optional: true});
        if(complications && complications !== watch.complications)
        {
            watch.complications = complications;
            watch.markModified('complications');
            isWatchUpdated = true;
        }

        let functions = Request.validateTextObjects(req.body.payload.functions, 'functions', {optional: true});
        if(functions && functions !== watch.functions)
        {
            watch.functions = functions;
            watch.markModified('functions');
            isWatchUpdated = true;
        }

        let caseMaterial = Request.validateText(req.body.payload.caseMaterial, 'caseMaterial', {optional: true});
        if(caseMaterial && caseMaterial !== watch.caseMaterial)
        {
            watch.caseMaterial = caseMaterial;
            watch.markModified('caseMaterial');
            isWatchUpdated = true;
        }

        let caseDiameter = Request.validateText(req.body.payload.caseDiameter, 'caseDiameter', {optional: true});
        if(caseDiameter && caseDiameter !== watch.caseDiameter)
        {
            watch.caseDiameter = caseDiameter;
            watch.markModified('caseDiameter');
            isWatchUpdated = true;
        }

        let caseHeight = Request.validateText(req.body.payload.caseHeight, 'caseHeight', {optional: true});
        if(caseHeight && caseHeight !== watch.caseHeight)
        {
            watch.caseHeight = caseHeight;
            watch.markModified('caseHeight');
            isWatchUpdated = true;
        }

        let caseFront = Request.validateText(req.body.payload.caseFront, 'caseFront', {optional: true});
        if(caseFront && caseFront !== watch.caseFront)
        {
            watch.caseFront = caseFront;
            watch.markModified('caseFront');
            isWatchUpdated = true;
        }

        let caseBack = Request.validateText(req.body.payload.caseBack, 'caseBack', {optional: true});
        if(caseBack && caseBack !== watch.caseBack)
        {
            watch.caseBack = caseBack;
            watch.markModified('caseBack');
            isWatchUpdated = true;
        }

        let caseBezelMaterial = Request.validateText(req.body.payload.caseBezelMaterial, 'caseBezelMaterial', {optional: true});
        if(caseBezelMaterial && caseBezelMaterial !== watch.caseBezelMaterial)
        {
            watch.caseBezelMaterial = caseBezelMaterial;
            watch.markModified('caseBezelMaterial');
            isWatchUpdated = true;
        }

        let waterProof = Request.validateText(req.body.payload.waterProof, 'waterProof', {optional: true});
        if(waterProof && waterProof !== watch.waterProof)
        {
            watch.waterProof = waterProof;
            watch.markModified('waterProof');
            isWatchUpdated = true;
        }

        let waterResistance = Request.validateText(req.body.payload.waterResistance, 'waterResistance', {optional: true});
        if(waterResistance && waterResistance !== watch.waterResistance)
        {
            watch.waterResistance = waterResistance;
            watch.markModified('waterResistance');
            isWatchUpdated = true;
        }

        let caseCrown = Request.validateText(req.body.payload.caseCrown, 'caseCrown', {optional: true});
        if(caseCrown && caseCrown !== watch.caseCrown)
        {
            watch.caseCrown = caseCrown;
            watch.markModified('caseCrown');
            isWatchUpdated = true;
        }

        let caseAdditionalFeatures = Request.validateTextObjects(req.body.payload.caseAdditionalFeatures, 'caseAdditionalFeatures', {optional: true});
        if(caseAdditionalFeatures && caseAdditionalFeatures !== watch.caseAdditionalFeatures)
        {
            watch.caseAdditionalFeatures = caseAdditionalFeatures;
            watch.markModified('caseAdditionalFeatures');
            isWatchUpdated = true;
        }

        let dialColour = Request.validateText(req.body.payload.dialColour, 'dialColour', {optional: true});
        if(dialColour && dialColour !== watch.dialColour)
        {
            watch.dialColour = dialColour;
            watch.markModified('model');
            isWatchUpdated = true;
        }

        let dialIndex = Request.validateText(req.body.payload.dialIndex, 'dialIndex', {optional: true});
        if(dialIndex && dialIndex !== watch.dialIndex)
        {
            watch.dialIndex = dialIndex;
            watch.markModified('dialIndex');
            isWatchUpdated = true;
        }

        let dialFinish = Request.validateText(req.body.payload.dialFinish, 'dialFinish', {optional: true});
        if(dialFinish && dialFinish !== watch.dialFinish)
        {
            watch.dialFinish = dialFinish;
            watch.markModified('dialFinish');
            isWatchUpdated = true;
        }

        let dialType = Request.validateText(req.body.payload.dialType, 'dialType', {optional: true});
        if(dialFinish && dialType !== watch.dialType)
        {
            watch.dialType = dialType;
            watch.markModified('dialType');
            isWatchUpdated = true;
        }

        let dialHands = Request.validateText(req.body.payload.dialHands, 'dialHands', {optional: true});
        if(dialHands && dialHands !== watch.dialHands)
        {
            watch.dialHands = dialHands;
            watch.markModified('dialHands');
            isWatchUpdated = true;
        }

        let dialAdditionalFeatures = Request.validateTextObjects(req.body.payload.dialAdditionalFeatures, 'dialAdditionalFeatures', {optional: true});
        if(dialAdditionalFeatures && dialAdditionalFeatures !== watch.dialAdditionalFeatures)
        {
            watch.dialAdditionalFeatures = dialAdditionalFeatures;
            watch.markModified('dialAdditionalFeatures');
            isWatchUpdated = true;
        }

        let band = Request.validateText(req.body.payload.band, 'band', {optional: true});
        if(band && band !== watch.band)
        {
            watch.band = band;
            watch.markModified('band');
            isWatchUpdated = true;
        }

        let bandMaterial = Request.validateText(req.body.payload.bandMaterial, 'bandMaterial', {optional: true});
        if(bandMaterial && bandMaterial !== watch.bandMaterial)
        {
            watch.bandMaterial = bandMaterial;
            watch.markModified('bandMaterial');
            isWatchUpdated = true;
        }

        let bandClasp = Request.validateText(req.body.payload.bandClasp, 'bandClasp', {optional: true});
        if(bandClasp && bandClasp !== watch.bandClasp)
        {
            watch.bandClasp = bandClasp;
            watch.markModified('bandClasp');
            isWatchUpdated = true;
        }

        let bandColour = Request.validateText(req.body.payload.bandColour, 'bandColour', {optional: true});
        if(bandColour && bandColour !== watch.bandColour)
        {
            watch.bandColour = bandColour;
            watch.markModified('bandColour');
            isWatchUpdated = true;
        }

        let bandClaspMaterial = Request.validateText(req.body.payload.bandClaspMaterial, 'bandClaspMaterial', {optional: true});
        if(bandClaspMaterial && bandClaspMaterial !== watch.bandClaspMaterial)
        {
            watch.bandClaspMaterial = bandClaspMaterial;
            watch.markModified('bandClaspMaterial');
            isWatchUpdated = true;
        }

        let bandAdditionalFeatures = Request.validateTextObjects(req.body.payload.bandAdditionalFeatures, 'bandAdditionalFeatures', {optional: true});
        if(bandAdditionalFeatures && bandAdditionalFeatures !== watch.bandAdditionalFeatures)
        {
            watch.bandAdditionalFeatures = bandAdditionalFeatures;
            watch.markModified('bandAdditionalFeatures');
            isWatchUpdated = true;
        }

        let price = Request.validateNumber(req.body.payload.price, 'price', {optional: true});
        if(price && price !== watch.price)
        {
            watch.price = price;
            watch.markModified('price');
            isWatchUpdated = true;
        }

        let priceCurrency = Request.validateText(req.body.payload.priceCurrency, 'priceCurrency', {optional: true});
        if(priceCurrency && priceCurrency !== watch.priceCurrency)
        {
            watch.priceCurrency = priceCurrency;
            watch.markModified('priceCurrency');
            isWatchUpdated = true;
        }

        let maximumDiscount = Request.validatePercentage(req.body.payload.maximumDiscount, 'maximumDiscount', {optional: true});
        if(maximumDiscount && maximumDiscount !== watch.maximumDiscount)
        {
            watch.maximumDiscount = maximumDiscount;
            watch.markModified('maximumDiscount');
            isWatchUpdated = true;
        }

        let mainPhotoUrl = Request.validateS3Url(req.body.payload.mainPhotoUrl, 'mainPhotoUrl', {optional: true});
        if(mainPhotoUrl && mainPhotoUrl !== watch.mainPhotoUrl)
        {
            watch.mainPhotoUrl = mainPhotoUrl;
            watch.markModified('mainPhotoUrl');
            isWatchUpdated = true;
        }

        let banner1PhotoUrl = Request.validateS3Url(req.body.payload.banner1PhotoUrl, 'bannerPhotoUrl1', {optional: true});
        if(banner1PhotoUrl && banner1PhotoUrl !== watch.banner1PhotoUrl)
        {
            watch.banner1PhotoUrl = banner1PhotoUrl;
            watch.markModified('banner1PhotoUrl');
            isWatchUpdated = true;
        }

        let banner2PhotoUrl = Request.validateS3Url(req.body.payload.banner2PhotoUrl, 'bannerPhotoUrl2', {optional: true});
        if(banner2PhotoUrl && banner2PhotoUrl !== watch.banner2PhotoUrl)
        {
            watch.banner2PhotoUrl = banner2PhotoUrl;
            watch.markModified('banner2PhotoUrl');
            isWatchUpdated = true;
        }

        let section1Title = Request.validateText(req.body.payload.section1Title, 'section1Title', {optional: true});
        if(section1Title && section1Title !== watch.section1Title)
        {
            watch.section1Title = section1Title;
            watch.markModified('section1Title');
            isWatchUpdated = true;
        }

        let section1Paragraph = Request.validateText(req.body.payload.section1Paragraph, 'section1Paragraph', {optional: true});
        if(section1Paragraph && section1Paragraph !== watch.section1Paragraph)
        {
            watch.section1Paragraph = section1Paragraph;
            watch.markModified('section1Paragraph');
            isWatchUpdated = true;
        }

        let section1PhotoUrl = Request.validateS3Url(req.body.payload.section1PhotoUrl, 'section1PhotoUrl', {optional: true});
        if(section1PhotoUrl && section1PhotoUrl !== watch.section1PhotoUrl)
        {
            watch.section1PhotoUrl = section1PhotoUrl;
            watch.markModified('section1PhotoUrl');
            isWatchUpdated = true;
        }

        let section2Title = Request.validateText(req.body.payload.section2Title, 'section2Title', {optional: true});
        if(section2Title && section2Title !== watch.section2Title)
        {
            watch.section2Title = section2Title;
            watch.markModified('section2Title');
            isWatchUpdated = true;
        }

        let section2Paragraph = Request.validateText(req.body.payload.section2Paragraph, 'section2Paragraph', {optional: true});
        if(section2Paragraph && section2Paragraph !== watch.section2Paragraph)
        {
            watch.section2Paragraph = section2Paragraph;
            watch.markModified('section2Paragraph');
            isWatchUpdated = true;
        }

        let section2PhotoUrl = Request.validateS3Url(req.body.payload.section2PhotoUrl, 'section2PhotoUrl', {optional: true});
        if(section2PhotoUrl && section2PhotoUrl !== watch.section2PhotoUrl)
        {
            watch.section2PhotoUrl = section2PhotoUrl;
            watch.markModified('section2PhotoUrl');
            isWatchUpdated = true;
        }

        let section3Title = Request.validateText(req.body.payload.section3Title, 'section3Title', {optional: true});
        if(section3Title && section3Title !== watch.section3Title)
        {
            watch.section3Title = section3Title;
            watch.markModified('section3Title');
            isWatchUpdated = true;
        }

        let section3Paragraph = Request.validateText(req.body.payload.section3Paragraph, 'section3Paragraph', {optional: true});
        if(section3Paragraph && section3Paragraph !== watch.section3Paragraph)
        {
            watch.section3Paragraph = section3Paragraph;
            watch.markModified('section3Paragraph');
            isWatchUpdated = true;
        }

        let section3PhotoUrl = Request.validateS3Url(req.body.payload.section3PhotoUrl, 'section3PhotoUrl', {optional: true});
        if(section3PhotoUrl && section3PhotoUrl !== watch.section3PhotoUrl)
        {
            watch.section3PhotoUrl = section3PhotoUrl;
            watch.markModified('section3PhotoUrl');
            isWatchUpdated = true;
        }

        let section4Title = Request.validateText(req.body.payload.section4Title, 'section4Title', {optional: true});
        if(section4Title && section4Title !== watch.section4Title)
        {
            watch.section4Title = section4Title;
            watch.markModified('section4Title');
            isWatchUpdated = true;
        }

        let section4Paragraph = Request.validateText(req.body.payload.section4Paragraph, 'section4Paragraph', {optional: true});
        if(section4Paragraph && section4Paragraph !== watch.section4Paragraph)
        {
            watch.section4Paragraph = section4Paragraph;
            watch.markModified('section4Paragraph');
            isWatchUpdated = true;
        }

        let section4PhotoUrl = Request.validateS3Url(req.body.payload.section4PhotoUrl, 'section4PhotoUrl', {optional: true});
        if(section4PhotoUrl && section4PhotoUrl !== watch.section4PhotoUrl)
        {
            watch.section4PhotoUrl = section4PhotoUrl;
            watch.markModified('section4PhotoUrl');
            isWatchUpdated = true;
        }

        let section5Titles = Request.validateText(req.body.payload.section5Titles, 'section5Title', {optional: true});
        if(section5Titles && section5Titles !== watch.section5Titles)
        {
            watch.section5Titles = section5Titles;
            watch.markModified('section5Titles');
            isWatchUpdated = true;
        }

        let section5Paragraphs = Request.validateText(req.body.payload.section5Paragraphs, 'section5Paragraph', {optional: true});
        if(section5Paragraphs && section5Paragraphs !== watch.section5Paragraphs)
        {
            watch.section5Paragraphs = section5Paragraphs;
            watch.markModified('section5Paragraphs');
            isWatchUpdated = true;
        }

        let section5PhotoUrls = Request.validateS3UrlObjects(req.body.payload.section5PhotoUrls, 'section5PhotoUrls', {optional: true});
        if(section5PhotoUrls && section5PhotoUrls !== watch.section5PhotoUrls)
        {
            watch.section5PhotoUrls = section5PhotoUrls;
            watch.markModified('section5PhotoUrls');
            isWatchUpdated = true;
        }

        if(isWatchUpdated)
        {
            watch.lastEditedByAdminObject = req.user._id;

            let savedWatch = await watch.save();

            let message = watch.referenceNumber + ' updated successfully.';
            return res.json(Response.payload({payload: watch, en: message}));
        }
        else
        {
            let message = watch.referenceNumber + ' was not updated.';
            return res.json(Response.payload({payload: watch, en: message}));
        }
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.deleteById = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true});

        let watch = await Watch.findById(req.params._id).populate('brandObject').populate('collectionObject');
        if(!watch)
            return res.json(Response.error({en: 'No watch is available with this Id.'}));

        if(watch.collectionObject)
        {
            let collection = await Collection.findById(watch.collectionObject._id);
            if(!collection)
                return res.json(Response.error({en: 'No collection is available with the watch\'s collection Id.'}));

            collection.watchObjects.pull({_id: watch._id});
            await collection.save();
        }

        await watch.remove();

        let message = watch.referenceNumber + ' deleted successfully.';
        return res.json(Response.payload({payload: watch, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};
