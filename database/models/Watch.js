const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-geojson-schema');

const WatchSchema = new Schema(
    {
        brand: {type: String, trim: true, required: true},
        model: {type: String, trim: true, required: true},
        referenceNumber: {type: String, trim: true, required: true, unique: true},
        gender: {type: String, trim: true},
        limited: {type: String, trim: true},
        awards: {type: String, trim: true},

        movementCaliberName: {type: String, trim: true, required: true},
        movementAutomaticOrManual: {type: String, trim: true},
        movementCaliberNumber: {type: String, trim: true, required: true},
        movementDiameter: {type: String, trim: true, required: true},
        movementHeight: {type: String, trim: true, required: true},
        movementJewels: {type: String, trim: true, required: true},
        movementFrequency: {type: String, trim: true, required: true},
        movementPowerReserve: {type: String, trim: true, required: true},
        movementCertificate: {type: String, trim: true},
        movementDecoration: {type: String, trim: true},
        movementSpring: {type: String, trim: true},
        movementTourbillon: {type: String, trim: true},
        movementRotor: {type: String, trim: true},
        movementAdditionalFeatures: [{value: {type: String, trim: true}}],

        functions: [{value: {type: String, trim: true, required: true}}],

        caseMaterial: {type: String, trim: true, required: true},
        caseDiameter: {type: String, trim: true, required: true},
        caseHeight: {type: String, trim: true, required: true},
        caseFront: {type: String, trim: true, required: true},
        caseBack: {type: String, trim: true, required: true},
        waterResistance: {type: String, trim: true},
        caseCrown: {type: String, trim: true},
        caseAdditionalFeatures: [{value: {type: String, trim: true}}],

        dialColour: {type: String, trim: true, required: true},
        dialIndex: {type: String, trim: true, required: true},
        dialFinish: {type: String, trim: true},
        dialHands: {type: String, trim: true, required: true},
        dialAdditionalFeatures: [{value: {type: String, trim: true}}],

        band: {type: String, trim: true, required: true},
        bandMaterial: {type: String, trim: true, required: true},
        bandClasp: {type: String, trim: true, required: true},
        bandColour: {type: String, trim: true, required: true},
        bandClaspMaterial: {type: String, trim: true, required: true},
        bandAdditionalFeatures: [{value: {type: String, trim: true}}],

        price: {type: Number, trim: true, required: true},
        priceCurrency: {type: String, trim: true, required: true},

        mainPhotoUrl: {type: String, trim: true, required: true},
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

        createdByAdmin: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
        lastEditedByAdmin: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
    },
    {
        timestamps: true
    });


module.exports = mongoose.model('Watch', WatchSchema);