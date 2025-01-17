const report = require('../tools/report');
const mongoose = require('mongoose');

const Admin = require('../database/models/Admin');
const Retailer = require('../database/models/Retailer');
const User = require('../database/models/User');

const Brand = require('../database/models/Brand');
const Watch = require('../database/models/Watch');
const Collection = require('../database/models/Collection');

let mongooseConnection = null;

module.exports.connect = async function(MONGODB_URL, CHRONOWIZ_ENV)
{
    if(mongooseConnection)
        return mongooseConnection;
    else
    {
        try
        {
            mongoose.Promise = global.Promise;

            let isProduction = CHRONOWIZ_ENV === 'chronowiz-tst' || CHRONOWIZ_ENV === 'chronowiz-stg' || CHRONOWIZ_ENV === 'chronowiz-liv';

            // if (!isProduction)
            mongoose.set('debug', true);

            mongooseConnection = await mongoose.connect(MONGODB_URL, {useNewUrlParser: true, config: {autoIndex: true}}); //TODO set autoIndex false in production


            Admin.createIndexes();
            Retailer.createIndexes();
            User.createIndexes();

            Brand.createIndexes();
            Collection.createIndexes();
            Watch.createIndexes();

            report.log({message: 'Connected successfully via mongoose to MongoDB'});

            return mongooseConnection;
        }
        catch(error)
        {
            throw error;
        }
    }
};

module.exports.disconnect = async function(MONGODB_URL, CHRONOWIZ_ENV)
{
    try
    {
        await mongoose.disconnect();
    }
    catch(error)
    {
        throw error;
    }
};
