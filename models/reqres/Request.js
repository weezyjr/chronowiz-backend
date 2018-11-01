const validator = require('validator');
const ValidationError = require('../errors/ValidationError');
const ErrorArgs = require('../errors/ErrorArgs');

const NAME_MAX_LENGTH = 255;
const EMAIL_ADDRESS_MAX_LENGTH = 255;

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

module.exports.validateText = function (text, fieldName, {optional = false} = {})
{
    //TODO protect against XSS

    if (!text && optional)
        return;

    if (!text)
        throw new ValidationError(
            {
                args: [fieldName]
            });

    if (typeof text === 'string')
    {
        if (!validator.isAlphanumeric(text.replace(/ /g, '').replace("'", '').replace('&', '').replace('ô', 'o').replace('è', 'e').replace('-', '')))
            throw new ValidationError(
                {
                    args: [fieldName, text]
                });

        if (text.length > NAME_MAX_LENGTH)
            throw new ValidationError(
                {
                    args: [fieldName, text]
                });
    }
    else
    {
        throw new ValidationError(
            {
                args: [fieldName, text]
            });
    }

    return text;
};

module.exports.validateTexts = function (texts, fieldName, {optional = false} = {})
{
    if (!texts && optional)
        return;

    if (!texts)
        throw new ValidationError({
            args: [fieldName]
        });

    if (!Array.isArray(texts))
        throw new ValidationError({
            args: [fieldName, texts]
        });

    for (let text of texts)
        this.validateText(text, fieldName, {optional});

    return texts;
};

module.exports.validateTextObjects = function (textObjects, fieldName, {optional = false} = {})
{
    if (!textObjects && optional)
        return;

    if (!textObjects)
        throw new ValidationError({
            args: [fieldName]
        });

    if (!Array.isArray(textObjects))
        throw new ValidationError({
            args: [fieldName, textObjects]
        });

    for (let textObject of textObjects)
        this.validateText(textObject.value, fieldName, {optional});

    return textObjects;
};

module.exports.validateEmail = function (email, {optional = false} = {})
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

module.exports.validatePassword = function (password, {optional = false} = {})
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

module.exports.validateS3Url = function (url, fieldName, {optional = false} = {})
{
    if (!url && optional)
        return;

    if (!url)
        throw new ValidationError({
            args: [ErrorArgs.S3URL, fieldName]
        });

    if (!validator.isURL(url))
        throw new ValidationError({
            args: [ErrorArgs.S3URL, url, fieldName]
        });

    if (!url.startsWith("https://s3-eu-west-1.amazonaws.com/"))
        throw new ValidationError({
            args: [ErrorArgs.S3URL, url, fieldName]
        });

    return url;
};

module.exports.validateS3Urls = function (urls, fieldName, {optional = false} = {})
{
    if (!urls && optional)
        return;

    if (!urls)
        throw new ValidationError({
            args: [ErrorArgs.S3URLS, fieldName]
        });

    for (let url of urls)
        this.validateS3Url(url, fieldName, {optional});

    return urls;
};