const mongoose = require('mongoose');

const jsonwebtoken = require('jsonwebtoken');
const UserRole = require("../../../models/roles/UserRole");

const GuestSchema = new mongoose.Schema(
    {
        deviceId: {type: String, trim: true, lowercase: true, required: true, unique: true, uniqueCaseInsensitive: true},

        // User role
        role: {type: String, enum: Object.values(UserRole), default: UserRole.GUEST, required: true},
    },
    {
        timestamps: true
    });

GuestSchema.methods.generateJWT = function (JWT_SECRET)
{
    let payload =
        {
            _id: this._id,
            role: this.role
        };

    return new Promise(function (resolve, reject)
    {
        jsonwebtoken.sign(payload, JWT_SECRET, {expiresIn: '1y'}, function (error, token)
        {
            if (error || !token)
                return reject(error);

            return resolve(token);
        });
    });
};

GuestSchema.methods.toJSON = function ()
{
    return {
        _id: this._id,
        role: this.role
    };
};

module.exports = mongoose.model('Guest', GuestSchema);
