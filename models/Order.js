const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    purpose:{
        type: String,
    },
    userEmail:{
        type: String,

    },
    items:[{}],
    amount:{
        type:Number,
    },
    delivery:String,
    deliveryLocation:String,
    payment:{
        type:String,
        enum:['pending','completed','failed'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('Order', OrderSchema);
