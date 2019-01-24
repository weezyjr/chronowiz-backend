const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.plugin(require('mongoose-regex-search'));

const BrandSchema = new Schema(
    {
        name: {type: String, trim: true, unique: true, required: true, searchable: true},

        logoPhotoUrl: {type: String, trim: true, required: true},
        headerPhotoUrl: {type: String, trim: true, required: false},
        banner1PhotoUrl: {type: String, trim: true, required: true},
        banner2PhotoUrl: {type: String, trim: true, required: true},

        maximumDiscount: {type: Number, trim: true, default: 100},

        collectionObjects: [{type: Schema.Types.ObjectId, ref: 'Collection', required: false}],

        headerBackgroundColor: {type: String, trim: true, required: false},
        headerContentColor: {type: String, trim: true, required: false},
        headerBackgroundOpacity: {type: Number, trim: true, required: false},

        createdByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
        lastEditedByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Brand', BrandSchema);
