const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.plugin(require('mongoose-regex-search'));

const CollectionSchema = new Schema(
    {
        brandObject: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},

        name: {type: String, trim: true, required: true, searchable: true},
        isUndefined: {type: Boolean, default: false},

        description: {type: String, trim: true},

        maximumDiscount: {type: Number, trim: true},

        watchObjects: [{type: Schema.Types.ObjectId, ref: 'Watch'}],

        createdByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
        lastEditedByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Collection', CollectionSchema);
