const MongooseAutoIncrementID = require('mongoose-auto-increment-reworked');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        orderNumber: {type: String, trim: true, unique: true, required: true},
        orderDate: {type: Date, unique: true, required: true},
        status: {type: String, trim: true, required: true},

        // Personal Info
        email: {type: String, trim: true, required: true},
        firstName: {type: String, trim: true},
        lastName: {type: String, trim: true},
        phoneNumber: {type: String, trim: true},

        // Billing address
        billingCountry: {type: String, trim: true, required: true},
        billingState: {type: String, trim: true},
        billingCity: {type: String, trim: true, required: true},
        billingZip: {type: String, trim: true},
        billingAddress: {type: String, trim: true, required: true},

        // Shipping Type
        shippingType: {type: String, trim: true, required: true},
        shippingSameAsBilling: {type: Boolean, required: true},

        // Shipping address
        shippingCountry: {type: String, trim: true, required: true},
        shippingState: {type: String, trim: true},
        shippingCity: {type: String, trim: true, required: true},
        shippingZip: {type: String, trim: true},
        shippingAddress: {type: String, trim: true, required: true},

        // Payment method
        paymentMethod: {type: String, trim: true, required: true},

        userObject: {type: Schema.Types.ObjectId, ref: 'User'},

        // Items
        watchObjects:
            [{
                watchObject: {type: Schema.Types.ObjectId, ref: 'Watch', required: true},
                quantity: {type: Number, required: true},
                price: {type: Number, required: true},
            }],

        totalPrice: {type: Number, required: true},
    },
    {
        timestamps: true
    });


OrderSchema.plugin(MongooseAutoIncrementID.MongooseAutoIncrementID.plugin, {modelName: 'Order', field: 'orderNumber'});

module.exports = mongoose.model('Order', OrderSchema);
