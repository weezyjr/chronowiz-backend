const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const Order = require('../../database/models/Order');
const User = require('../../database/models/User');
const validator = require('validator');

module.exports.create = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let order = new Order();

        order.orderDate = new Date();
        order.status = "Verifying";

        order.email = Request.validateEmail(req.body.payload.email, 'email', {optional: false});
        order.firstName = Request.validateText(req.body.payload.firstName, 'firstName', {optional: false});
        order.lastName = Request.validateText(req.body.payload.lastName, 'lastName', {optional: false});
        order.phone = Request.validateText(req.body.payload.phone, 'phone', {optional: false});

        order.billingCountry = Request.validateText(req.body.payload.billingCountry, 'billingCountry', {optional: false});
        order.billingState = Request.validateText(req.body.payload.billingState, 'billingState', {optional: true});
        order.billingCity = Request.validateText(req.body.payload.billingCity, 'billingCity', {optional: false});
        order.billingZip = Request.validateText(req.body.payload.billingZip, 'billingZip', {optional: true});
        order.billingAddress = Request.validateText(req.body.payload.billingAddress, 'billingAddress', {optional: false});

        order.shippingType = Request.validateText(req.body.payload.shippingType, 'shippingType', {optional: false});
        order.shippingSameAsBilling = Request.validateBoolean(req.body.payload.shippingSameAsBilling, 'shippingSameAsBilling', {optional: false});

        if(order.shippingSameAsBilling)
        {
            order.shippingCountry = order.billingCountry;
            order.shippingState = order.billingState;
            order.shippingCity = order.billingCity;
            order.shippingZip = order.billingZip;
            order.shippingAddress = order.billingAddress;
        }
        else
        {
            order.shippingCountry = Request.validateText(req.body.payload.shippingCountry, 'shippingCountry', {optional: false});
            order.shippingState = Request.validateText(req.body.payload.shippingState, 'shippingState', {optional: true});
            order.shippingCity = Request.validateText(req.body.payload.shippingCity, 'shippingCity', {optional: false});
            order.shippingZip = Request.validateText(req.body.payload.shippingZip, 'shippingZip', {optional: true});
            order.shippingAddress = Request.validateText(req.body.payload.shippingAddress, 'shippingAddress', {optional: false});
        }

        order.paymentMethod = Request.validateText(req.body.payload.paymentMethod, 'paymentMethod', {optional: false});

        if(req.user)
            order.userObject = req.user._id;

        let requestWatchObjects = Request.validateArray(req.body.payload.watchObjects, 'watchObjects', {optional: false});
        for(let requestWatchObject of requestWatchObjects)
        {
            Request.validateIdOrObject(requestWatchObject.watchObject, 'watchObject', {optional: false});
            Request.validateNumber(requestWatchObject.quantity, 'quantity', {optional: false});
            Request.validateNumber(requestWatchObject.price, 'price', {optional: false});

            order.watchObjects.push(requestWatchObject);
        }

        let savedOrder = await order.save();

        if(req.user)
        {
            let user = await User.findById(req.user._id).populate('orderObjects');
            if(!user)
                return res.json(Response.error({en: 'No user is available with this Id. User must be logged in to save their orders to their profiles'}));

            if(!user.orderObjects)
                user.orderObjects = [];

            user.orderObjects.push(savedOrder);

            await user.save();
        }

        let message = 'Order #RF' + savedOrder.orderNumber + ' created successfully.';
        return res.json(Response.payload({payload: savedOrder, en: message}));
    }
    catch(error)
    {
        next(error);
    }
};

module.exports.readByIdOrOrderNumber = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforceParams: true});

        let order;

        if(validator.isMongoId(req.params._id))
        {
            order = await Order.findById(req.params._id).populate(
                {
                    path: 'watchObjects',
                    populate:
                        {
                            path: 'watchObject'
                        }
                }).populate('userObject');

            if(!order)
                return res.json(Response.error({en: 'No order is available with this Id.'}));
        }
        else
        {
            order = await Order.findOne({orderNumber: req.params._id}).populate(
                {
                    path: 'watchObjects',
                    populate:
                        {
                            path: 'watchObject'
                        }
                });

            if(!order)
                return res.json(Response.error({en: 'No order is available with this order number.'}));
        }

        if(!order)
            return res.json(Response.error({en: 'No order is available with this Id'}));

        let user = await User.findById(req.user._id).populate('orderObjects');
        if(!user)
            return res.json(Response.error({en: 'No user is available with this Id. User must be logged in to view any of their orders'}));

        if(!user.orderObjects)
            return res.json(Response.error({en: 'This order does not belong to the current user.'}));

        let existingOrder = user.orderObjects.find(existingOrder => existingOrder.orderNumber === order.orderNumber);
        if(!existingOrder)
            return res.json(Response.error({en: 'This order does not belong to the current user.'}));

        return res.json(Response.payload({payload: order}));
    }
    catch(error)
    {
        next(error);
    }
};
