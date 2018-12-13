const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WatchSchema = new Schema(
    {
        brandObject: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
        collectionObject: {type: Schema.Types.ObjectId, ref: 'Collection'},
        model: {type: String, trim: true},
        referenceNumber: {type: String, trim: true, unique: true, required: true},
        gender: {type: String, trim: true},
        productionYear: {type: String, trim: true},
        limited: {type: String, trim: true},
        awards: {type: String, trim: true},
        perpetual: {type: String, trim: true},

        movementCaliberName: {type: String, trim: true},
        movementAutomaticOrManual: {type: String, trim: true},
        movementCaliberNumber: {type: String, trim: true},
        movementDiameter: {type: String, trim: true},
        movementHeight: {type: String, trim: true},
        movementJewels: {type: String, trim: true},
        movementFrequency: {type: String, trim: true},
        movementPowerReserve: {type: String, trim: true},
        movementCertificate: {type: String, trim: true},
        movementDecoration: {type: String, trim: true},
        movementSpring: {type: String, trim: true},
        movementTourbillon: {type: String, trim: true},
        movementRotor: {type: String, trim: true},
        movementAdditionalFeatures: [{value: {type: String, trim: true}}],

        functions: [{value: {type: String, trim: true}}],

        caseMaterial: {type: String, trim: true},
        caseDiameter: {type: String, trim: true},
        caseHeight: {type: String, trim: true},
        caseFront: {type: String, trim: true},
        caseBack: {type: String, trim: true},
        caseBezelMaterial: {type: String, trim: true},
        waterResistance: {type: String, trim: true},
        caseCrown: {type: String, trim: true},
        caseAdditionalFeatures: [{value: {type: String, trim: true}}],

        dialColour: {type: String, trim: true},
        dialIndex: {type: String, trim: true},
        dialFinish: {type: String, trim: true},
        dialHands: {type: String, trim: true},
        dialAdditionalFeatures: [{value: {type: String, trim: true}}],

        band: {type: String, trim: true},
        bandMaterial: {type: String, trim: true},
        bandClasp: {type: String, trim: true},
        bandColour: {type: String, trim: true},
        bandClaspMaterial: {type: String, trim: true},
        bandAdditionalFeatures: [{value: {type: String, trim: true}}],

        price: {type: Number, trim: true},
        priceCurrency: {type: String, trim: true},

        mainPhotoUrl: {type: String, trim: true},
        banner1PhotoUrl: {type: String, trim: true},
        banner2PhotoUrl: {type: String, trim: true},

        section1Title: {type: String, trim: true},
        section1Paragraph: {type: String, trim: true},
        section1PhotoUrl: {type: String, trim: true},

        section2Title: {type: String, trim: true},
        section2Paragraph: {type: String, trim: true},
        section2PhotoUrl: {type: String, trim: true},

        section3Title: {type: String, trim: true},
        section3Paragraph: {type: String, trim: true},
        section3PhotoUrl: {type: String, trim: true},

        section4Title: {type: String, trim: true},
        section4Paragraph: {type: String, trim: true},
        section4PhotoUrl: {type: String, trim: true},

        section5Title: {type: String, trim: true},
        section5Paragraph: {type: String, trim: true},
        section5PhotoUrls: [{value: {type: String, trim: true}}],

        createdByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
        lastEditedByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Watch', WatchSchema);