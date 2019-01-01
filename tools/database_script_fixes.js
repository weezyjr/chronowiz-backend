const mongooseConnection = require('../database/mongooseConnection');

// const oldString = 'https://s3-eu-west-1.amazonaws.com/chronowiz-liv-media';
// const newString = 'https://media.chronowiz.com';

// const oldString = 'https://s3-eu-west-1.amazonaws.com/chronowiz-dev-media';
// const newString = 'https://media-dev.chronowiz.com';

const oldString = 'https://media.dev.chronowiz.com';
const newString = 'https://media-dev.chronowiz.com';

const mongoose = require('mongoose');

const Brand = require('../database/models/Brand');
const Watch = require('../database/models/Watch');
const Collection = require('../database/models/Collection');

const Admin = require('../database/models/Admin');

const MONGODB_URL = "mongodb+srv://chronowiz-dev-backend:FaizFikak123@chronowiz-dev-licgt.mongodb.net/chronowiz?retryWrites=true;";
// const MONGODB_URL = "mongodb+srv://chronowiz-liv-backend:FaizFikak1%23@cluster0-8rkfv.mongodb.net/chronowiz?retryWrites=true";

let run = async function()
{
    try
    {
        try
        {
            mongoose.Promise = global.Promise;
            mongoose.set('debug', true);

            let mongooseConnection = await mongoose.connect(MONGODB_URL, {useNewUrlParser: true, config: {autoIndex: true}}); //TODO set autoIndex false in production

            console.log({message: 'Connected successfully via mongoose to MongoDB'});

            let brands = await Brand.find();

            for(let brand of brands)
            {
                if(brand.logoPhotoUrl)
                    brand.logoPhotoUrl = brand.logoPhotoUrl.replace(oldString, newString);

                if(brand.headerPhotoUrl)
                    brand.headerPhotoUrl = brand.headerPhotoUrl.replace(oldString, newString);

                if(brand.banner1PhotoUrl)
                    brand.banner1PhotoUrl = brand.banner1PhotoUrl.replace(oldString, newString);

                if(brand.banner2PhotoUrl)
                    brand.banner2PhotoUrl = brand.banner2PhotoUrl.replace(oldString, newString);

                await brand.save();
            }

            let admin = await Admin.findById('5bd76531bf5428aba1c4be47');

            let watches = await Watch.find();

            for(let watch of watches)
            {
                if(!watch.brandObject)
                {
                    let watchObject = watch.toObject();
                    console.log(watchObject.brand);
                    if(watchObject.brand)
                    {
                        let brand = await Brand.findOne({name: watchObject.brand});
                        if(brand)
                        {
                            console.log(brand.name);
                            watch.brandObject = brand;
                        }
                        else
                        {
                            console.log('cant find brand for name: ' + watchObject.brand);
                            continue;
                        }

                    }
                    else
                        continue;
                }

                if(watch.mainPhotoUrl)
                    watch.mainPhotoUrl = watch.mainPhotoUrl.replace(oldString, newString);

                if(!watch.createdByAdminObject)
                    watch.createdByAdminObject = admin;

                if(!watch.lastEditedByAdminObject)
                    watch.lastEditedByAdminObject = admin;

                await watch.save();
            }
        }
        catch(error)
        {
            throw error;
        }
    }
    catch(error)
    {
        console.error({error});
        throw error;
    }
    finally
    {
        console.log('done');
    }
};

run();