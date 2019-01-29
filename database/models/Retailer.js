const report = require('../../tools/report.js');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const RetailerSchema = new mongoose.Schema(
    {
        // Email
        email: {type: String, trim: true, lowercase: true, required: true, uniqueCaseInsensitive: true},

        // Password
        password: {type: String, required: true},

        companyName: {type: String, trim: true},
        firstName: {type: String, trim: true},
        lastName: {type: String, trim: true},
        address: {type: String, trim: true},
        city: {type: String, trim: true},
        country: {type: String, trim: true},
        poBox: {type: String, trim: true},
        phoneNumber: {type: String, trim: true},
        fax: {type: String, trim: true},
        mobileNumber: {type: String, trim: true},

        maximumBrandDiscounts:
            [{
                brandObject: {type: Schema.Types.ObjectId, ref: 'Brand'},
                maximumBrandDiscount: {type: Number}
            }],

        maximumCollectionDiscounts:
            [{
                brandObject: {type: Schema.Types.ObjectId, ref: 'Brand'},
                collectionObject: {type: Schema.Types.ObjectId, ref: 'Collection'},
                maximumCollectionDiscount: {type: Number}
            }],

        maximumWatchDiscounts:
            [{
                brandObject: {type: Schema.Types.ObjectId, ref: 'Brand'},
                collectionObject: {type: Schema.Types.ObjectId, ref: 'Collection'},
                watchObject: {type: Schema.Types.ObjectId, ref: 'Watch'},
                maximumWatchDiscount: {type: Number}
            }],

        watchObjects:
            [{
                watchObject: {type: Schema.Types.ObjectId, ref: 'Watch'},
                retailerWatchDiscount: {type: Number},
            }],

        orderObjects:
            [{
                orderObject: {type: Schema.Types.ObjectId, ref: 'Order'},
                retailerWatchDiscount: {type: Number},
            }],

        createdByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
        lastEditedByAdminObject: {type: Schema.Types.ObjectId, ref: 'Admin', required: true}
    },
    {
        timestamps: true
    });

RetailerSchema.pre('save', async function(next)
{
    if(!this.isModified('password')) return next();

    try
    {
        let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch(error)
    {
        next(error);
    }
});

RetailerSchema.methods.comparePassword = async function(password)
{
    try
    {
        return await bcrypt.compare(password, this.password);
    }
    catch(error)
    {
        report.error({error});
        throw error;
    }
};

RetailerSchema.methods.generateJWT = function(JWT_SECRET)
{
    let payload =
        {
            _id: this._id
        };

    return new Promise(function(resolve, reject)
    {
        jsonwebtoken.sign(payload, JWT_SECRET, {expiresIn: '1y'}, function(error, token)
        {
            if(error || !token)
                return reject(error);

            return resolve(token);
        });
    });
};

RetailerSchema.methods.toJSON = function()
{
    return {
        _id: this._id,

        email: this.email,
        companyName: this.companyName,
        firstName: this.firstName,
        lastName: this.lastName,
        address: this.address,
        city: this.city,
        country: this.country,
        poBox: this.poBox,
        phoneNumber: this.phoneNumber,
        fax: this.fax,
        mobileNumber: this.mobileNumber,
        maximumBrandDiscounts: this.maximumBrandDiscounts,
        maximumCollectionDiscounts: this.maximumCollectionDiscounts,
        maximumWatchDiscounts: this.maximumWatchDiscounts,
        watchObjects: this.watchObjects
    };
};

module.exports = mongoose.model('Retailer', RetailerSchema);
