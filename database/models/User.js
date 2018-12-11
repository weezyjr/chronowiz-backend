const report = require('../../tools/report.js');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
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

        // Name
        firstName: {type: String, trim: true, required: false},
        lastName: {type: String, trim: true, required: false}
    },
    {
        timestamps: true
    });

UserSchema.pre('save', async function(next)
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

UserSchema.methods.comparePassword = async function(password)
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

UserSchema.methods.generateJWT = function(JWT_SECRET)
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

UserSchema.methods.toJSON = function()
{
    return {
        _id: this._id,

        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
    };
};

module.exports = mongoose.model('User', UserSchema);