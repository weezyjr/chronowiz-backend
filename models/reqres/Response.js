const report = require('../../tools/report');
const ErrorType = require('../errors/ErrorType');

module.exports.payload = function({payload = undefined, en = undefined, debug = undefined, actionType = undefined} = {})
{
    return {
        response:
            {
                type: ResponseType.SUCCESS,
                message:
                    {
                        en,
                        debug: debug || en
                    },
                actionType,
                payload
            }
    };
};

module.exports.error = function({error = undefined, en = undefined, debug = undefined, errorType = undefined, payload = undefined, actionType = undefined, request = undefined} = {})
{
    if(error && error.errorType)
    {
        errorType = error.errorType;
    }
    else if(error && error.code === 11000)
    {
        errorType = ErrorType.DUPLICATE; // TODO present the error in a much better way and hide the object

        let firstDoubleQuote = error.message.indexOf("\"");
        let secondDoubleQuote = error.message.indexOf("\"", firstDoubleQuote + 1);
        let duplicateEntry = error.message.substring(firstDoubleQuote + 1, secondDoubleQuote);

        en = duplicateEntry + ' already exists';
        debug = error.message;
        error = undefined;
    }

    let response =
        {
            response:
                {
                    type: ResponseType.ERROR,
                    error,
                    errorType: errorType || (error ? error.errorType : undefined),
                    message:
                        {
                            en: en || (error ? error.en : undefined),
                            debug: debug || (error ? (error.debug || error.message || error.errmsg || error.en) : en)
                        },
                    actionType,
                    payload
                }
        };

    report.error({error: response, request});

    return response;
};

const ResponseType =
    {
        SUCCESS: 'SUCCESS',
        ERROR: 'ERROR'
    };