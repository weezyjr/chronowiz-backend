const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const Order = require('../../database/models/Order');
const validator = require('validator');

module.exports.readAll = async function(req, res, next)
{
    try
    {
        let orders = await Order.find({});

        await orders.sort(sortByOrderNumber);

        return res.json(Response.payload({payload: orders}));
    }
    catch(error)
    {
        next(error);
    }
};

function sortByOrderNumber(a, b)
{
    if(a.orderNumber < b.orderNumber)
        return -1;
    if(a.orderNumber > b.orderNumber)
        return 1;
    return 0;
}

module.exports.readByIdOrOrderNumber = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParams: true});

        if(validator.isMongoId(req.params._id))
        {
            let order = await Order.findById(req.params._id).populate(
                {
                    path: 'watchObjects',
                    populate:
                        {
                            path: 'watchObject'
                        }
                });

            if(!order)
                return res.json(Response.error({en: 'No order is available with this Id.'}));

            return res.json(Response.payload({payload: order}));
        }
        else
        {
            let order = await Order.findOne({orderNumber: req.params._id}).populate(
                {
                    path: 'watchObjects',
                    populate:
                        {
                            path: 'watchObject'
                        }
                });

            if(!order)
                return res.json(Response.error({en: 'No order is available with this order number.'}));

            return res.json(Response.payload({payload: order}));
        }
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.updateById = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParamsId: true, enforcePayload: true});

        let order = await Order.findById(req.params._id);
        if(!order)
            return res.json(Response.error({en: 'No order is available with this Id.'}));

        let status = Request.validateText(req.body.payload.status, 'status', {optional: true});
        if(status)
        {
            order.status = status;
            order.markModified('status');
        }

        order.lastEditedByAdminObject = req.user._id;

        let savedOrder = await order.save();

        let message = 'Order RF#' + savedOrder.orderNumber + ' updated successfully.';
        return res.json(Response.payload({payload: savedOrder, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};
