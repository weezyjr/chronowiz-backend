const report = require('../../../tools/report.js');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const UserRole = require('../../../models/roles/UserRole.js');

const UserSchema = new mongoose.Schema(
    {
        // Username
        username: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
            unique: true,
            uniqueCaseInsensitive: true
        },

        // Email
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: false,
            uniqueCaseInsensitive: true,
            index: {unique: true, partialFilterExpression: {email: {$type: 'string'}}}
        },
        emailVerificationCode: {type: String, required: false},
        emailVerificationCodeTrials: {type: String, required: true, default: 0, min: 0, max: 3},
        recoveryEmailVerificationCode: {type: String, required: false},
        isEmailVerified: {type: Boolean, required: true, default: false},

        // Mobile
        mobile: {
            type: String,
            trim: true,
            lowercase: true,
            required: false,
            uniqueCaseInsensitive: true,
            index: {unique: true, partialFilterExpression: {mobile: {$type: 'string'}}}
        },
        mobileVerificationCode: {type: String, trim: true, required: false},
        mobileVerificationCodeTrials: {type: String, required: true, default: 0, min: 0, max: 3},
        recoveryMobileVerificationCode: {type: String, required: false},
        isMobileVerified: {type: Boolean, required: true, default: false},

        // Password
        password: {type: String, required: true},

        // Name
        firstName: {type: String, trim: true, required: false},
        lastName: {type: String, trim: true, required: false},

        // Personal information
        gender: {type: String, enum: ['male', 'female'], required: false},
        birthday: {
            day: {type: Number, required: false},
            month: {type: Number, required: false},
            year: {type: Number, required: false}
        },

        maritalStatus: {type: String, enum: ['single', 'married'], required: false},
        jobTitle: {type: String, required: false},

        // Profile picture
        profilePictureUrl: {type: String, required: false},
        previousProfilePicturesUrls: {type: [String], required: false},
        profileGalleryUrls: {type: [String], required: false},

        // GettingStarted
        isShowGetStarted: {type: Boolean, required: true, default: true},

        // User role
        role: {type: String, enum: Object.values(UserRole), default: UserRole.PENDING, required: true},

        recentSearches: [{
            placeId: {type: Schema.Types.ObjectId, ref: 'Place', required: true},
            placeName: {
                en: {type: String, trim: true, required: true},
                ar: {type: String, trim: true, required: true}
            }
        }],
        recentVisits: [{
            placeId: {type: Schema.Types.ObjectId, ref: 'Place', required: true},
            placeName: {
                en: {type: String, trim: true, required: true},
                ar: {type: String, trim: true, required: true}
            }
        }],
        userSettings: {
            language: {type: String, enum: ['english', 'arabic'], required: true, default: "english"}
        },
        recentQueries: [{
            lng: {type: Number, required: true},
            lat: {type: Number, required: true},
            filter: {
                categoryIds: {type: [Schema.Types.ObjectId]},
                subCategoryIds: {type: [Schema.Types.ObjectId]},
                hashtagIds: {type: [Schema.Types.ObjectId]},
            },
            query: String
        }]
    },
    {
        timestamps: true
    });

UserSchema.pre('save', async function (next)
{
    if (!this.isModified('password')) return next();

    try
    {
        let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error)
    {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function (password)
{
    try
    {
        return await bcrypt.compare(password, this.password);
    }
    catch (error)
    {
        report.error({error});
        throw error;
    }
};

UserSchema.methods.generateJWT = function (JWT_SECRET)
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

UserSchema.methods.toJSON = function ()
{
    return {
        _id: this._id,

        username: this.username,

        email: this.email,
        isEmailVerified: this.isEmailVerified,

        mobile: this.mobile,
        isMobileVerified: this.isMobileVerified,

        firstName: this.firstName,
        lastName: this.lastName,

        gender: this.gender,
        birthday: this.birthday,
        country: this.country,
        city: this.city,
        area: this.area,
        maritalStatus: this.maritalStatus,
        jobTitle: this.jobTitle,

        profilePictureUrl: this.profilePictureUrl,
        previousProfilePicturesUrls: this.previousProfilePicturesUrls,
        profileGalleryUrls: this.profileGalleryUrls,

        isShowGetStarted: this.isShowGetStarted,

        interestsCategories: this.interestsCategories,

        role: this.role,

        userSettings: this.userSettings,
    };
};

module.exports = mongoose.model('User', UserSchema);
