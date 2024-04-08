const Coupon = require("../Models/couponModel")
const catchAsync = require('express-async-handler');
const appError = require("../utils/appError")



exports.createOne=catchAsync(async(req,res,next)=>{

    const doc=await Coupon.create(req.body)

    res.status(201).json({
        status:'success',
        data:doc
    })

})


exports.deleteOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const doc = await Coupon.findById(id)

    if (!doc) {
        return next(new appError(`Can't find Coupon on this id`, 404));
    }

    await doc.remove()

    res.status(201).json({
        status: "deleted success",
    })
})

exports.deleteAll = catchAsync(async (req, res, next) => {

    await Coupon.deleteMany()

    res.status(201).json({
        status: "Delete All Successfully",
    })
})

exports.getOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    let doc = await Coupon.findById(id)

    if (!doc) {
        return next(new appError(`Can't find Coupon on this id`, 404));
    }

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.updateOne = catchAsync(async (req, res, next) => {
    
    const doc = await Coupon.findByIdAndUpdate(req.user.id, req.body, { new: true }) //new is true => to return new doc after update

    if (!doc) {
        return next(new appError(`Can't find Coupon on this id`, 404));
    }

   // doc.save()

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})


exports.getAll = catchAsync(async (req, res) => {

    const documents = await Coupon.find();

    res
        .status(200)
        .json({ results: documents.length, data: documents });
});


