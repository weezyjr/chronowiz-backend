const report = require('../../tools/report.js');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const RetailerSchema = new mongoose.Schema(
    {
        // Email
        email:
            {
                type: String,
                trim: true,
                lowercase: true,
                required: false,
                uniqueCaseInsensitive: true,
                index: {unique: true, partialFilterExpression: {email: {$type: 'string'}}}
            },

        // Password
        password: {type: String, required: true},

        firstName: {type: String, trim: true, required: false},
        lastName: {type: String, trim: true, required: false},

        companyName: {type: String, trim: true, required: false},
        address: {type: String, trim: true, required: false},
        city: {type: String, trim: true, required: false},
        country: {type: String, trim: true, required: false},
        poBox: {type: String, trim: true, required: false},
        phoneNumber: {type: String, trim: true, required: false},
        fax: {type: String, trim: true, required: false},
        mobileNumber: {type: String, trim: true, required: false},

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
        firstName: this.firstName,
        lastName: this.lastName
    };
};

module.exports = mongoose.model('Retailer', RetailerSchema);