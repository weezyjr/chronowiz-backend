const Request = require('../../models/reqres/Request');
const Response = require('../../models/reqres/Response');
const Order = require('../../database/models/Order');
const Watch = require('../../database/models/Watch');
const User = require('../../database/models/User');
const validator = require('validator');
const ses = require('../../aws/ses');
const json2html = require('node-json2html');

module.exports.create = async function(req, res, next)
{
    try
    {
        Request.validateReq(req, {enforcePayload: true});

        let order = new Order();

        order.orderDate = new Date();
        order.status = "Verifying";

        order.email = Request.validateEmail(req.body.payload.email, 'email', {optional: false});
        order.firstName = Request.validateName(req.body.payload.firstName, 'firstName', {optional: false});
        order.lastName = Request.validateName(req.body.payload.lastName, 'lastName', {optional: false});
        order.phoneNumber = Request.validateText(req.body.payload.phoneNumber, 'phoneNumber', {optional: false});

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

        let displayWatchItems = [];

        let requestWatchObjects = Request.validateArray(req.body.payload.watchObjects, 'watchObjects', {optional: false});
        for(let requestWatchObject of requestWatchObjects)
        {
            let watchId = Request.validateIdOrObject(requestWatchObject.watchObject, 'watchObject', {optional: false});
            let watch = await Watch.findById(watchId);
            if(!watch)
                return res.json(Response.error({en: 'No watch is available with the watch Id.'}));

            let quantity = Request.validateNumber(requestWatchObject.quantity, 'quantity', {optional: false});

            requestWatchObject.price = watch.price * quantity;

            let displayPrice = '$' + requestWatchObject.price.toLocaleString();

            order.watchObjects.push(requestWatchObject);

            displayWatchItems.push({watch, quantity, displayPrice});
        }

        order.totalPrice = order.watchObjects
            .map(function(item)
            {
                return item.price;
            })
            .reduce(function(prev, next)
            {
                return prev + next;
            });

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

        let body =
            'Order number #RF: ' + savedOrder.orderNumber + '<br>' +
            'Order date: ' + savedOrder.orderDate + '<br>' +
            'Order status: ' + savedOrder.status + '<br>' +

            'User email: ' + savedOrder.email + '<br>' +
            'User firstName: ' + savedOrder.firstName + '<br>' +
            'User lastName: ' + savedOrder.lastName + '<br>' +
            'User phoneNumber: ' + savedOrder.phoneNumber + '<br>' +

            'User billingCountry: ' + savedOrder.billingCountry + '<br>' +
            'User billingState: ' + savedOrder.billingState + '<br>' +
            'User billingCity: ' + savedOrder.billingCity + '<br>' +
            'User billingZip: ' + savedOrder.billingZip + '<br>' +
            'User billingAddress: ' + savedOrder.billingAddress + '<br>' +

            'Order shippingType: ' + savedOrder.shippingType + '<br>' +
            'Order shippingSameAsBilling: ' + savedOrder.shippingSameAsBilling + '<br>' +

            'User shippingCountry: ' + savedOrder.shippingCountry + '<br>' +
            'User shippingState: ' + savedOrder.shippingState + '<br>' +
            'User shippingCity: ' + savedOrder.shippingCity + '<br>' +
            'User shippingZip: ' + savedOrder.shippingZip + '<br>' +
            'User shippingAddress: ' + savedOrder.shippingAddress + '<br>' +

            'Order paymentMethod: ' + savedOrder.paymentMethod + '<br>' +

            'Order totalPrice: $' + savedOrder.totalPrice.toLocaleString() + '<br>';

        // for(let watchObject of order.watchObjects)
        // {
        //     body = body +
        //         'Order item watch reference number: ' + watchObject.referenceNumber + '<br>' +
        //         'Order item watch quantity: ' + watchObject.quantity + '<br>' +
        //         'Order item price: ' + watchObject.price + '<br>';
        // }

        var transform = {
            tag: 'tr',
            children: [
                {
                    "tag": "td",
                    "html": "${watch.referenceNumber}"
                },
                {
                    "tag": "td",
                    "html": "${watch.model}"
                },
                {
                    "tag": "td",
                    "html": "${quantity}"
                },
                {
                    "tag": "td",
                    "html": "${displayPrice}"
                }]
        };

        let items = json2html.transform(displayWatchItems, transform);

        let itemsHTML = `<div class="container">
        <p>
        <table class="table table-bordered" border="1">
            <thead>
                <tr>
                    <th>Watch reference Number</th>
                    <th>Watch model</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>${items}</tbody>
        </table>
        </div>`;

        body += itemsHTML;

        if(process.env.CHRONOWIZ_ENV === 'chronowiz-liv')
        {
            await ses.sendGenericMail(["fikak@chronowiz.com", "heiba@chronowiz.com", order.email], "Order received #RF" + order.orderNumber, body);
        }
        else
        {
            await ses.sendGenericMail(["heiba@chronowiz.com", "w33zy.7@gmail.com", order.email], "Order received #RF" + order.orderNumber, body);
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
            order = await Order.findById(req.params._id)
                .populate('userObject')
                .populate('watchObjects.watchObject');

            if(!order)
                return res.json(Response.error({en: 'No order is available with this Id.'}));
        }
        else
        {
            order = await Order.findOne({orderNumber: req.params._id})
                .populate('userObject')
                .populate('watchObjects.watchObject');

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
