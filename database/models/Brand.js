const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-geojson-schema');

const BrandSchema = new Schema(
    {
        name: {type: String, trim: true, unique: true, required: true},

        logoPhotoUrl: {type: String, trim: true, required: true},
        headerPhotoUrl: {type: String, trim: true, required: false},
        banner1PhotoUrl: {type: String, trim: true, required: true},
        banner2PhotoUrl: {type: String, trim: true, required: true},

        collectionObjects: [{type: Schema.Types.ObjectId, ref: 'Collection', required: false}],

        createdByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
        lastEditedByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
    },
    {
        timestamps: true
    });


module.exports = mongoose.model('Brand', BrandSchema);