const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.plugin(require('mongoose-regex-search'));

const BrandSchema = new Schema(
    {
        name: {type: String, trim: true, unique: true, required: true, searchable: true},

        logoPhotoUrl: {type: String, trim: true, required: true},
        darkLogoPhotoUrl: {type: String, trim: true, required: true},

        headerPhotoUrl: {type: String, trim: true},
        banner1PhotoUrl: {type: String, trim: true, required: true},
        banner2PhotoUrl: {type: String, trim: true, required: true},

        maximumDiscount: {type: Number},

        collectionObjects: [{type: Schema.Types.ObjectId, ref: 'Collection'}],

        headerBackgroundColor: {type: String, trim: true},
        headerBackgroundOpacity: {type: Number, default: 100},
        headerContentColor: {type: Boolean, default: true},

        pageBackgroundColor: {type: String, trim: true},
        pageBackgroundOpacity: {type: Number, default: 100},
        pageContentColor: {type: Boolean, default: true},

        createdByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
        lastEditedByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Brand', BrandSchema);
