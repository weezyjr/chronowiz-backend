const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-geojson-schema');

const CollectionSchema = new Schema(
    {
        brandObject: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
        name: {type: String, trim: true, required: true},

        createdByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
        lastEditedByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
    },
    {
        timestamps: true
    });


module.exports = mongoose.model('Collection', CollectionSchema);