const mongoose = require('mongoose');
const MedicineSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please add a name'],
        unique:true,
        trim: true,
        maxlength:[100,'Name can not be more than 100 charecters']
    },
    category:{
        type: String,
        enum:['enteral','parenteral','other'],
        default:'enteral'
    },
    highlights:{
        type: [String],
        required:[true,'Please add a description/Highlights']
    },
    diseases:{
        type: [String],
        required:[true,'Please add a deases with comma seperated'],
    },
    originalPrice:{
        type: Number,
        required:[true,'Please add Original Price']
    },
    discountPercent:{
        type: Number,
        required:[true, 'Please add discount']
    },
    discountedPrice:Number,
    priceInOtherSites:[
        {
            type: String
        }
    ],
    stock:[
        {
            seller:{
                type: mongoose.Schema.ObjectId,
                ref:'User',
                required: true
            },
            stockAmount:Number,
            locLatitude:Number,
            locLongitude:Number
        }
    ],
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

},{
    toJSON:{ virtuals: true},
    toObject:{ virtuals:true}
});

module.exports = mongoose.model('Medicine', MedicineSchema);
