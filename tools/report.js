let logDNALogger;
const _ = require('lodash');

module.exports.setup = function (CHRONOWIZ_APP_NAME, CHRONOWIZ_ENV, LOGDNA_KEY)
{
    let logDNA = require('logdna');
    let logDNAOptions = {
        app: CHRONOWIZ_APP_NAME,
        env: CHRONOWIZ_ENV,
        index_meta: true
    };

    logDNALogger = logDNA.setupDefaultLogger(LOGDNA_KEY, logDNAOptions);
};

module.exports.log = function ({message = undefined, request = undefined} = {})
{
    if(request)
        request = _.pick(request, ['url','query','body']);

    if(!message)
    {
        message = "empty message";
    }

    if(typeof message === 'object')
    {
        console.dir({message, request}, {colors: true});
        logDNALogger.log({message, request});
    }
    else
    {
        console.log({message, request});
        logDNALogger.log({message, request});
    }
};

module.exports.error = function ({error = undefined, request = undefined} = {})
{
    if(request)
        request = _.pick(request, ['url','query','body']);

    if(!error)
    {
        error = "empty error";
    }

    if (typeof error === 'object')
    {
        console.error(error, error.stack);
        logDNALogger.error({error, request});
    }
    else
    {
        console.error({error, request});
        logDNALogger.error({error, request});
    }
};