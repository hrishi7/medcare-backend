const Medicine = require('../models/Medicine');
const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//@desc     Get all medicines
//@route    Get /api/v1/medicines
//@access   Public
exports.getMedicines = asyncHandler( async(req, res, next) =>{
        let medicines = await Medicine.find({});
        res.status(200).json(medicines);
})

//@desc     Get single medicine
//@route    Get /api/v1/medicines/:id
//@access   Public
exports.getMedicine = asyncHandler(async(req, res, next) =>{
        const medicine = await Medicine.findById(req.params.id);
        if(!medicine){
            return next(new ErrorResponse(`Medicine Not Found With The id of ${req.params.id}`,404));
        }
        res.status(200).json({success: true, data: medicine})

})

//@desc     Create Medicine
//@route    Post /api/v1/medicines
//@access   Private
exports.createMedicine =asyncHandler( async(req, res, next) =>{
        //Add user to req.body
        req.body.user = req.user.id;
        //check if user is seller
        if(req.user.role !== 'seller'){
                return next(new ErrorResponse(`user ${req.user.id} is not authorize to create this medicine`,401));
        }
        const medicine = await Medicine.create(req.body);
        res.status(201).json({success:true, data: medicine});
})

//@desc     Update medicine
//@route    Put /api/v1/medicines/:id
//@access   Private
exports.updateMedicine =asyncHandler( async(req, res, next) =>{

        let medicine = await Medicine.findById(req.params.id);
        if(!medicine){
            return next(new ErrorResponse(`Medicine Not Found With The id of ${req.params.id}`,404));
        }

        //make sure user is seller
        if(req.user.role !== 'seller'){
            return next(new ErrorResponse(`user ${req.user.id} is not authorize to update this medicine`,401));
        }

        medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body,{
                new: true,
                runValidators: true
        })
        res.status(200).json({success: true,data: medicine});
})

//@desc     Delete medicine
//@route    Delete /api/v1/medicines/:id
//@access   Private
exports.deleteMedicine =asyncHandler( async(req, res, next) =>{
        let medicine = await Medicine.findById(req.params.id);
        if(!medicine){
            return next(new ErrorResponse(`Medicine Not Found With The id of ${req.params.id}`,404));
        }
          //make sure user is seller
        if(req.user.role !== 'seller'){
            return next(new ErrorResponse(`user ${req.user.id} is not authorize to delete this medicine`,401));
        }
        medicine.remove();
        res.status(200).json({success: true,data: {}});

})

//@desc     Update medicine
//@route    Put /api/v1/medicines/updateStock/:id
//@access   Private

//not working currently properly
// need to break from foreach loop as soon as update is doen otherwise search for the end and add the row into array
exports.updateMedicineStock =asyncHandler( async(req, res, next) =>{

        let medicine = await Medicine.findById(req.params.id);
        if(!medicine){
            return next(new ErrorResponse(`Medicine Not Found With The id of ${req.params.id}`,404));
        }

        //make sure user is seller or seller
        if(req.user.role !== 'seller'){
                return next(new ErrorResponse(`Not authorize of access this route`,401));
        }

        medicine = await Medicine.findOne({_id: req.params.id});

        if(medicine.stock.length<= 0){
                 //simple add the user with details
                 medicine.stock.unshift({
                        seller: req.user.id,
                        stockAmount: req.body.stockAmount,
                        locLatitude:req.body.locLatitude,
                        locLongitude:req.body.locLongitude
                });
                await medicine.save();
                res.status(200).json({success:true, data:medicine})
        } else{
                medicine.stock.forEach(async (each,index)=>{
                        if(each.seller == req.user.id){
                                each.stockAmount= req.body.stockAmount;
                                each.locLatitude=req.body.locLatitude;
                                each.locLongitude=req.body.locLongitude;
                                await medicine.save();
                                return res.status(200).json({success:true, data:medicine});
                                // break;
                        }
                        if(index == medicine.stock.length - 1){
                                medicine.stock.unshift({
                                        seller: req.user.id,
                                        stockAmount: req.body.stockAmount,
                                        locLatitude:req.body.locLatitude,
                                        locLongitude:req.body.locLongitude
                                });
                                await medicine.save();
                                return res.status(200).json({success:true, data:medicine})
                        }

                });

        }


})
