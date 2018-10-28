const validator = require('validator');
const ValidationError = require('../errors/ValidationError');
const ErrorArgs = require('../errors/ErrorArgs');

const NAME_MAX_LENGTH = 255;
const ADDRESS_FIRSTLINE_MAX_LENGTH = 255;
const ADDRESS_SECONDLINE_MAX_LENGTH = 255;
const ADDRESS_THIRDLINE_MAX_LENGTH = 255;
const ADDRESS_NEAREST_LANDMARK_MAX_LENGTH = 255;
const ADDRESS_NEAREST_PARKING_MAX_LENGTH = 255;
const PHONE_NUMBER_MAX_LENGTH = 15;
const EMAIL_ADDRESS_MAX_LENGTH = 255;
const HASHTAG_MAX_LENGTH = 255;

module.exports.validateReq = function (req, {enforcePayload = false, enforceParamsId = false, enforceQuery = false} = {})
{
    if (!req)
        throw new ValidationError(
            {
                args: [ErrorArgs.REQUEST]
            });

    if (enforcePayload)
    {
        if (!req.body)
            throw new ValidationError({
                args: [ErrorArgs.REQUEST_BODY]
            });

        if (!req.body.payload)
            throw new ValidationError({
                args: [ErrorArgs.REQUEST_PAYLOAD]
            });
    }

    if (enforceParamsId)
    {
        if (!req.params)
            throw new ValidationError({
                args: [ErrorArgs.REQUEST_PARAMS]
            });

        this.validateId(req.params._id, 'req.params');
    }

    if (enforceQuery)
    {
        if (!req.query)
            throw new ValidationError({
                args: [ErrorArgs.REQUEST_QUERY]
            });
    }

    return req;
};

module.exports.validateId = function (_id, {optional = false} = {})
{
    if (!_id && optional)
        return;

    if (!_id)
        throw new ValidationError({
            args: [ErrorArgs.ID]
        });

    if (!validator.isMongoId(_id))
        throw new ValidationError({
            args: [ErrorArgs.ID, _id]
        });

    return _id;
};

module.exports.validateIds = function (Ids, {optional = false} = {})
{
    if (!Ids && optional)
        return;

    if (!Ids)
        throw new ValidationError({
            args: [ErrorArgs.IDS]
        });

    if (!Array.isArray(Ids))
        throw new ValidationError({
            args: [ErrorArgs.IDS, Ids]
        });

    for (let _id of Ids)
        this.validateId(_id, {optional});

    return Ids;
};

module.exports.validateUsername = function (username, {optional = false} = {})
{
    if (!username && optional)
        return;

    if (!username)
        throw new ValidationError({
            args: [ErrorArgs.USERNAME]
        });

    if (!validator.isAlphanumeric(username))
        throw new ValidationError({
            args: [ErrorArgs.USERNAME, username]
        });

    if (username.length < 5)
        throw new ValidationError({
            args: [ErrorArgs.USERNAME, username]
        });

    if (username.length > 30)
        throw new ValidationError({
            args: [ErrorArgs.USERNAME, username]
        });

    return username;
};

module.exports.validateName = function (name, fieldName, {optional = false} = {})
{
    if (!name && optional)
        return;

    if (!name)
        throw new ValidationError(
            {
                args: [fieldName]
            });

    if (typeof name === 'string')
    {
        if (!validator.isAlphanumeric(name.replace(/ /g, '').replace("'", '').replace('&', '').replace('ô', 'o').replace('è', 'e').replace('-', '')))
            throw new ValidationError(
                {
                    args: [fieldName, name]
                });

        if (name.length > NAME_MAX_LENGTH)
            throw new ValidationError(
                {
                    args: [fieldName, name]
                });
    }
    else
    {
        throw new ValidationError(
            {
                args: [fieldName, name]
            });
    }

    return name;
};

module.exports.validateNames = function (names, fieldName, {optional = false} = {})
{
    if (!names && optional)
        return;

    if (!names)
        throw new ValidationError({
            args: [fieldName, ErrorArgs.NAME]
        });

    if (!Array.isArray(names))
        throw new ValidationError({
            args: [fieldName, ErrorArgs.NAME, names]
        });

    for (let name of names)
        this.validateName(name, fieldName, {optional});

    return names;
};


module.exports.validateUserEmail = function (email, {optional = false} = {})
{
    if (!email && optional)
        return;

    if (!email)
        throw new ValidationError({
            args: [ErrorArgs.EMAIL]
        });

    if (!validator.isEmail(email))
        throw new ValidationError({
            args: [ErrorArgs.EMAIL, email]
        });
    if (email.length > EMAIL_ADDRESS_MAX_LENGTH)
        throw new ValidationError({
            args: [ErrorArgs.EMAIL, email]
        });
    email = email.toLowerCase();

    return email;
};

module.exports.validatePMEmail = function (email, {optional = false} = {})
{
    return this.validateUserEmail(email, {optional}); // Later, I might PM to have @gmail and @hotmail etc emails, and only allow them work emails
};

module.exports.validateAdminEmail = function (email, {optional = false} = {})
{
    email = this.validateUserEmail(email, {optional});

    if (email.split('@')[1] !== 'chronowiz.com')
        throw new ValidationError({
            args: [ErrorArgs.ADMIN_EMAIL, email]
        });

    return email;
};

module.exports.validateMobile = function (mobile, {optional = false} = {})
{
    if (!mobile && optional)
        return;

    if (!mobile)
        throw new ValidationError({
            args: [ErrorArgs.MOBILE]
        });

    if (mobile.substr(0, 1) !== '+')
        throw new ValidationError({
            args: [ErrorArgs.MOBILE, mobile]
        });

    if (!validator.isMobilePhone(mobile, 'any'))
        throw new ValidationError({
            args: [ErrorArgs.MOBILE, mobile]
        });

    if (mobile.length > PHONE_NUMBER_MAX_LENGTH)
        throw new ValidationError({
            args: [ErrorArgs.MOBILE, mobile]
        });

    return mobile;
};

module.exports.validatePhone = function (phone, {optional = false} = {})
{
    if (!phone && optional)
        return;

    if (!phone)
        throw new ValidationError({
            args: [ErrorArgs.PHONE]
        });

    if (phone.substr(0, 1) !== '+')
        throw new ValidationError({
            args: [ErrorArgs.PHONE, phone]
        });

    if (phone.length > PHONE_NUMBER_MAX_LENGTH)
        throw new ValidationError({
            args: [ErrorArgs.PHONE, phone]
        });

    return phone;
};

module.exports.validatePhonesArray = function (phones, {optional = false} = {})
{
    if (!phones && optional)
        return;

    if (!phones)
        throw new ValidationError({
            args: [ErrorArgs.PHONES]
        });

    if (!Array.isArray(phones))
        throw new ValidationError({
            args: [ErrorArgs.PHONES, phones]
        });

    for (let phone of phones)
        this.validatePhone(phone, {optional});

    return phones;
};

module.exports.validateUserPassword = function (password, {optional = false} = {})
{
    if (!password && optional)
        return;

    if (!password)
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD]
        });

    if (password.length < 8)
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD, password]
        });

    if (password.length > 20)
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD, password]
        });

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$_\-@!%&*?])[A-Za-z\d#$_\-@!%&*?]{8,20}$/.test(password))
    {
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD, password]
        });
    }

    return password;
};

module.exports.validatePMPassword = function (password, {optional = false} = {})
{
    if (!password && optional)
        return;

    if (!password)
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD]
        });

    if (password.length < 8)
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD, password]
        });

    if (password.length > 20)
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD, password]
        });

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$_\-@!%&*?])[A-Za-z\d#$_\-@!%&*?]{8,20}$/.test(password))
    {
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD, password]
        });
    }

    return password;
};

module.exports.validateAdminPassword = function (password, {optional = false} = {})
{
    if (!password && optional)
        return;

    if (!password)
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD]
        });

    if (password.length < 8)
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD, password]
        });

    if (password.length > 20)
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD, password]
        });

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$_\-@!%&*?])[A-Za-z\d#$_\-@!%&*?]{8,20}$/.test(password))
    {
        throw new ValidationError({
            args: [ErrorArgs.PASSWORD, password]
        });
    }

    return password;
};

module.exports.validateVerificationCode = function (verificationCode, type = '', {optional = false} = {})
{
    if (!verificationCode && optional)
        return;

    if (!verificationCode)
        throw new ValidationError({
            args: [ErrorArgs.VERIFICATION_CODE]
        });

    if (typeof(verificationCode) !== 'string')
        throw new ValidationError({
            args: [ErrorArgs.VERIFICATION_CODE, verificationCode]
        });

    if (!validator.isNumeric(verificationCode) || !validator.isLength(verificationCode, {min: 6, max: 6}))
        throw new ValidationError({
            args: [ErrorArgs.VERIFICATION_CODE, verificationCode]
        });

    return verificationCode;
};

module.exports.validateRole = function (role, {optional = false} = {})
{
    if (!role && optional)
        return;

    if (!role)
        throw new ValidationError({
            args: [ErrorArgs.ROLE]
        });

    if (!validator.isAlpha(role))
        throw new ValidationError({
            args: [ErrorArgs.ROLE, role]
        });

    return role;
};

module.exports.validateDialCode = function (dialCode, {optional = false} = {})
{
    if (!dialCode && optional)
        return;

    if (!dialCode)
        throw new ValidationError({
            args: [ErrorArgs.DIAL_CODE]
        });

    if (dialCode.substr(0, 1) !== '+')
        throw new ValidationError({
            args: [ErrorArgs.DIAL_CODE, dialCode]
        });

    if (!validator.isNumeric(dialCode.substr(1)))
        throw new ValidationError({
            args: [ErrorArgs.DIAL_CODE, dialCode]
        });

    return dialCode;
};

module.exports.validateUrl = function (url, {optional = false} = {})
{
    if (!url && optional)
        return;

    if (!url)
        throw new ValidationError({
            args: [ErrorArgs.URL]
        });

    if (!validator.isURL(url))
        throw new ValidationError({
            args: [ErrorArgs.URL, url]
        });

    return url;
};

module.exports.validateUrls = function (urls, {optional = false} = {})
{
    if (!urls && optional)
        return;

    if (!urls)
        throw new ValidationError({
            args: [ErrorArgs.URLS]
        });

    if (!Array.isArray(urls))
        throw new ValidationError({
            args: [ErrorArgs.URLS, urls]
        });

    for (let url of urls)
        this.validateUrl(url, {optional});

    return urls;
};

module.exports.validateS3Url = function (url, fieldName, {optional = false} = {})
{
    if (!url && optional)
        return;

    if (!url)
        throw new ValidationError({
            args: [ErrorArgs.URL, fieldName]
        });

    if (!validator.isURL(url))
        throw new ValidationError({
            args: [ErrorArgs.URL, url, fieldName]
        });

    if (!url.startsWith("https://s3-eu-west-1.amazonaws.com/"))
        throw new ValidationError({
            args: [ErrorArgs.URL, url, fieldName]
        });

    return url;
};

module.exports.validateS3Urls = function (urls, fieldName, {optional = false} = {})
{
    if (!urls && optional)
        return;

    if (!urls)
        throw new ValidationError({
            args: [ErrorArgs.URLS, fieldName]
        });

    for (let url of urls)
        this.validateS3Url(url, fieldName, {optional});

    return urls;
};

module.exports.validateHashtag = function (hashtag, {optional = false} = {})
{
    if (!hashtag && optional)
        return;

    if (!hashtag)
        throw new ValidationError({
            args: [ErrorArgs.HASHTAG]
        });

    //TODO validate Hashtag to include arabic or english, numbers and _
    if (hashtag.length > HASHTAG_MAX_LENGTH)
        throw new ValidationError({
            args: [ErrorArgs.HASHTAG, hashtag]
        });
    return hashtag;
};

module.exports.validateAddress = function (address, {optional = false} = {})
{
    if (!address && optional)
        return;

    if (!address)
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS]
        });

    if (typeof address !== 'object')
    {
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS, address]
        });
    }

    if (!address.firstLine)
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS_FIRST_LINE]
        });

    if (typeof address.firstLine !== 'object')
    {
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS_FIRST_LINE, address.firstLine]
        });
    }

    if (!address.firstLine.en)
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS_FIRST_LINE_ENGLISH]
        });

    if (!validator.isAlphanumeric(address.firstLine.en.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, '')))
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS_FIRST_LINE_ENGLISH, address.firstLine.en]
        });
    if (address.firstLine.en.length > ADDRESS_FIRSTLINE_MAX_LENGTH)
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS_FIRST_LINE_ENGLISH, address.firstLine.en]
        });

    if (!address.firstLine.ar)
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS_FIRST_LINE_ARABIC]
        });

    if (!validator.isAlphanumeric(address.firstLine.ar.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, ''), 'ar'))
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS_FIRST_LINE_ARABIC, address.firstLine.ar]
        });
    if (address.firstLine.ar.length > ADDRESS_FIRSTLINE_MAX_LENGTH)
        throw new ValidationError({
            args: [ErrorArgs.ADDRESS_FIRST_LINE_ARABIC, address.firstLine.ar]
        });
    if (address.secondLine)
    {
        if (typeof address.secondLine !== 'object')
        {
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_SECOND_LINE, address.secondLine]
            });
        }

        if (!address.secondLine.en)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_SECOND_LINE_ENGLISH]
            });

        if (!validator.isAlphanumeric(address.secondLine.en.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, '')))
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_SECOND_LINE_ENGLISH, address.secondLine.en]
            });
        if (address.secondLine.en.length > ADDRESS_SECONDLINE_MAX_LENGTH)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_SECOND_LINE_ENGLISH, address.secondLine.en]
            });
        if (!address.secondLine.ar)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_SECOND_LINE_ARABIC]
            });

        if (!validator.isAlphanumeric(address.secondLine.ar.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, ''), 'ar'))
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_SECOND_LINE_ARABIC, address.secondLine.ar]
            });
        if (address.secondLine.ar.length > ADDRESS_SECONDLINE_MAX_LENGTH)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_SECOND_LINE_ARABIC, address.secondLine.ar]
            });
    }

    if (address.thirdLine)
    {
        if (typeof address.thirdLine !== 'object')
        {
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_THIRD_LINE, address.thirdLine]
            });
        }

        if (!address.thirdLine.en)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_THIRD_LINE_ENGLISH]
            });

        if (!validator.isAlphanumeric(address.thirdLine.en.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, '')))
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_THIRD_LINE_ENGLISH, address.thirdLine.en]
            });
        if (address.thirdLine.en.length > ADDRESS_THIRDLINE_MAX_LENGTH)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_THIRD_LINE_ENGLISH, address.thirdLine.en]
            });
        if (!address.thirdLine.ar)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_THIRD_LINE_ARABIC]
            });

        if (!validator.isAlphanumeric(address.thirdLine.ar.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, ''), 'ar'))
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_THIRD_LINE_ARABIC, address.thirdLine.ar]
            });
        if (address.thirdLine.ar.length > ADDRESS_THIRDLINE_MAX_LENGTH)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_THIRD_LINE_ARABIC, address.thirdLine.ar]
            });
    }

    if (address.nearestLandmark)
    {
        if (typeof address.nearestLandmark !== 'object')
        {
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_LANDMARK, address.nearestLandmark]
            });
        }

        if (!address.nearestLandmark.en)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_LANDMARK_ENGLISH]
            });

        if (!validator.isAlphanumeric(address.nearestLandmark.en.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, '')))
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_LANDMARK_ENGLISH, address.nearestLandmark.en]
            });
        if (address.nearestLandmark.en.length > ADDRESS_NEAREST_LANDMARK_MAX_LENGTH)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_LANDMARK_ENGLISH, address.nearestLandmark.en]
            });
        if (!address.nearestLandmark.ar)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_LANDMARK_ARABIC]
            });

        if (!validator.isAlphanumeric(address.nearestLandmark.ar.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, ''), 'ar'))
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_LANDMARK_ARABIC, address.nearestLandmark.ar]
            });
        if (address.nearestLandmark.ar.length > ADDRESS_NEAREST_LANDMARK_MAX_LENGTH)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_LANDMARK_ARABIC, address.nearestLandmark.ar]
            });
    }

    if (address.nearestParking)
    {
        if (typeof address.nearestParking !== 'object')
        {
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_PARKING, address.nearestParking]
            });
        }

        if (!address.nearestParking.en)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_PARKING_ENGLISH]
            });

        if (!validator.isAlphanumeric(address.nearestParking.en.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, '')))
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_PARKING_ENGLISH, address.nearestParking.en]
            });
        if (address.nearestParking.en.length > ADDRESS_NEAREST_PARKING_MAX_LENGTH)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_PARKING_ENGLISH, address.nearestParking.en]
            });
        if (!address.nearestParking.ar)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_PARKING_ARABIC]
            });

        if (!validator.isAlphanumeric(address.nearestParking.ar.replace(/ /g, '').replace(/'/g, '').replace(/,/g, '').replace(/\./g, ''), 'ar'))
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_PARKING_ARABIC, address.nearestParking.ar]
            });
        if (address.nearestParking.ar.length > ADDRESS_NEAREST_PARKING_MAX_LENGTH)
            throw new ValidationError({
                args: [ErrorArgs.ADDRESS_NEAREST_PARKING_ARABIC, address.nearestParking.ar]
            });
    }

    return address;
};

module.exports.validateBirthday = function (birthday, {optional = false} = {})
{
    if (!birthday && optional)
        return;
    if (!birthday)
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY]
        });
    if (!birthday.day)
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY_DAY]
        });

    if (!Number.isInteger(birthday.day))
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY_DAY, birthday.day]
        });

    if (birthday.day < 1 || birthday.day > 31)
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY_DAY, birthday.day]
        });

    if (!birthday.month)
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY_MONTH]
        });

    if (!Number.isInteger(birthday.month))
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY_MONTH, birthday.month]
        });

    if (birthday.month > 12 || birthday.month < 1)
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY_MONTH, birthday.month]
        });

    if (!birthday.year)
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY_YEAR]
        });

    if (!Number.isInteger(birthday.year))
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY_YEAR, birthday.year]
        });

    if (birthday.year < 1900 || birthday.year > new Date().getFullYear())
        throw new ValidationError({
            args: [ErrorArgs.BIRTHDAY_YEAR, birthday.year]
        });

    return birthday;
};

module.exports.validateOpeningTimes = function (openingTimes, {optional = false} = {})
{
    if (!openingTimes && optional)
        return;

    if (!openingTimes)
        throw new ValidationError({
            args: [ErrorArgs.OPENING_TIMES]
        });

    if (typeof openingTimes !== 'object')
    {
        throw new ValidationError({
            args: [ErrorArgs.OPENING_TIMES, openingTimes]
        });
    }

    this.validateDay(openingTimes.Sunday, 'Sunday', {optional});
    this.validateDay(openingTimes.Monday, 'Monday', {optional});
    this.validateDay(openingTimes.Tuesday, 'Tuesday', {optional});
    this.validateDay(openingTimes.Wednesday, 'Wednesday', {optional});
    this.validateDay(openingTimes.Thursday, 'Thursday', {optional});
    this.validateDay(openingTimes.Friday, 'Friday', {optional});
    this.validateDay(openingTimes.Saturday, 'Saturday', {optional});

    return openingTimes;
};

module.exports.validateDay = function (day, dayName = '', {optional = false} = {})
{
    if (!day && optional)
        return;

    if (!day)
        throw new ValidationError({
            args: [ErrorArgs.OPENING_TIMES_DAY, dayName]
        });

    if (typeof day !== 'object')
    {
        throw new ValidationError({
            args: [ErrorArgs.OPENING_TIMES_DAY, dayName, day]
        });
    }

    if (!day.shifts)
        return;

    for (let shift of day.shifts)
    {
        this.validateTime(shift.opens, dayName, 'opening time', {optional});
        this.validateTime(shift.closes, dayName, 'closing time', {optional});
    }
};

module.exports.validateTime = function (time, dayName = '', timeName = '', {optional = false} = {})
{
    if (!time && optional)
        return;

    if (!time)
        throw new ValidationError({
            args: [ErrorArgs.OPENING_TIMES_TIME, dayName, timeName]
        });

    if (typeof time !== 'object')
    {
        throw new ValidationError({
            args: [ErrorArgs.OPENING_TIMES_TIME, dayName, timeName, time]
        });
    }

    this.validateTimeHour(time.hour, dayName, timeName, {optional});
    this.validateTimeMinutes(time.minutes, dayName, timeName, {optional});
};

module.exports.validateText = function (text, {optional = false} = {})
{
    if (!text && optional)
        return;

    if (!text)
        throw new ValidationError({
            args: [ErrorArgs.TEXT]
        });

    // if (!validator.isAlphanumeric(text.replace(/ /g, '')))
    //     throw new ValidationError({
    //         en: 'Invalid request. Please contact support@chronowiz.com',
    //         ar: '',
    //         debug: objectName + ' text is invalid'
    //     });

    return text;
};

