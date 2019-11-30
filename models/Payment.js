const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
    payment_id:String,
    status:String,
    amount:Number,
    userEmail:String,
    created_at:String,
    billing_instrument:String,
    userId:String
});

module.exports = mongoose.model('Payment', PaymentSchema);
