// const {Schema} = require("mongoose");

// const PositionsSchema = new Schema({
//     product:String,
//     name:String,
//     qty:Number,
//     avg:Number,
//     net:String,
//     day:String,
//     isLoss:Boolean,
// });
// module.erxpress = {PositionsSchema};


const mongoose = require("mongoose");

const PositionsSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    qty: {
        type: Number,
        required: true,
    },

    avg: {
        type: Number,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    net: {
        type: String,
        required: true,
    },

    day: {
        type: String,
        required: true,
    },

    isLoss: {
        type: Boolean,
        default: false,
    },
});

module.exports = { PositionsSchema };

