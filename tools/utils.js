const _ = require('lodash');

module.exports.addUniqueToArray = function (array, itemToAdd, fieldNames)
{
    if (!fieldNames || fieldNames.length === 0)
    {
        for (let item of array)
        {
            if (_.isEqual(item, itemToAdd))
                return array;
        }
    }
    else
    {
        for (let item of array)
        {
            for (let field of fieldNames)
            {
                if (_.isEqual(_.pick(item, field), _.pick(itemToAdd, field)))
                    return array;
            }
        }
    }

    array.push(itemToAdd);

    return array;
};

module.exports.removeItemByIdFromArray = function (array, element)
{
    return array.filter(e => !_.isEqual(e._id, element._id));
};

module.exports.removeItemFromArray = function (array, element)
{
    return array.filter(e => !_.isEqual(e, element));
};