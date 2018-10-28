const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-geojson-schema');

const WatchSchema = new Schema(
    {
        brand: {type: String, trim: true, required: true},
        model: {type: String, trim: true, required: true},
        referenceNumber: {type: String, trim: true, required: true, unique: true},
        gender: {type: String, trim: true, required: false},
        limited: {type: String, trim: true, required: false},

        movementType: {type: String, trim: true, required: true},
        movementCaliberType: {type: String, trim: true, required: true},
        movementCaliberNumber: {type: String, trim: true, required: true},
        movementDiameter: {type: String, trim: true, required: true},
        movementHeight: {type: String, trim: true, required: true},
        movementJewels: {type: String, trim: true, required: true},
        movementFrequency: {type: String, trim: true, required: true},
        movementPowerReserve: {type: String, trim: true, required: true},
        movementCertificate: {type: String, trim: true, required: false},
        movementCertificateType: {type: String, trim: true, required: false},
        movementDecoration: {type: String, trim: true, required: false},
        movementSpring: {type: String, trim: true, required: false},
        movementTourbillon: {type: String, trim: true, required: false},
        movementRotor: {type: String, trim: true, required: false},
        movementAdditionalFeatures: {type: [String], trim: true, required: false},

        functions: {type: [String], trim: true, required: true},

        caseMaterial: {type: String, trim: true, required: true},
        caseDiameter: {type: String, trim: true, required: true},
        caseHeight: {type: String, trim: true, required: true},
        caseFront: {type: String, trim: true, required: true},
        caseBack: {type: String, trim: true, required: true},
        waterResistance: {type: String, trim: true, required: true},
        caseCrown: {type: String, trim: true, required: true},
        caseAdditionalFeatures: {type: [String], trim: true, required: false},

        dialColour: {type: String, trim: true, required: true},
        dialIndex: {type: String, trim: true, required: true},
        dialFinish: {type: String, trim: true, required: false},
        dialHands: {type: String, trim: true, required: true},
        dialAdditionalFeatures: {type: [String], trim: true, required: false},

        band: {type: String, trim: true, required: true},
        bandMaterial: {type: String, trim: true, required: true},
        bandClasp: {type: String, trim: true, required: true},
        bandColour: {type: String, trim: true, required: true},
        bandClaspMaterial: {type: String, trim: true, required: true},
        bandAdditionalFeatures: {type: [String], trim: true, required: false},

        price: {type: String, trim: true, required: true},

        mainPhotoUrl: {type: String, trim: true, required: true},
        bannerPhotoUrl1: {type: String, trim: true, required: false},
        bannerPhotoUrl2: {type: String, trim: true, required: false},

        section1Title: {type: String, trim: true, required: false},
        section1Paragraph: {type: String, trim: true, required: false},
        section1PhotoUrl: {type: String, trim: true, required: false},

        section2Title: {type: String, trim: true, required: false},
        section2Paragraph: {type: String, trim: true, required: false},
        section2PhotoUrl: {type: String, trim: true, required: false},

        section3Title: {type: String, trim: true, required: false},
        section3Paragraph: {type: String, trim: true, required: false},
        section3PhotoUrl: {type: String, trim: true, required: false},

        section4Title: {type: String, trim: true, required: false},
        section4Paragraph: {type: String, trim: true, required: false},
        section4PhotoUrl: {type: String, trim: true, required: false},

        section5Title: {type: String, trim: true, required: false},
        section5Paragraph: {type: String, trim: true, required: false},
        section5PhotoUrls: {type: [String], trim: true, required: false},
    },
    {
        timestamps: true
    });


module.exports = mongoose.model('Watch', WatchSchema);