'use strict';
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name:{
        type: String,
        required : true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
        },
        price: {
            type: Number
        },
        quantity: {
            type: Number
        }
    }],
    orderedDate: {
        type: Date,
        default: () => new Date().toISOString().split('T')[0]
    },
    deliveredDate: {
        type: Date
    },
    status: {
        type: String,
        default: "Pending",
        enum: ['Pending','Delivered', 'Cancelled'],
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Completed', 'Failed', 'Cancelled', 'Refunded'],
        required : true
    },
    totalAmount: {
        type: Number,
        required: true
    }
})

const orderModel = mongoose.model('order', orderSchema)

module.exports = orderModel