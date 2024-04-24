const User = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const catchAsync = require("express-async-handler");
const appError = require("../utils/appError");

function shuffledReviews(array) {
    // Loop over the array from the end to the beginning
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap the elements at positions i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//*************************************************** */
exports.setServiceUserIds = (req, res, next) => {
    //Allow nested routes
    if (!req.body.service) {
        req.body.service = req.params.id;
        // console.log(req.body.tour)
    }

    if (!req.body.user) {
        req.body.user = req.user.id;
    }
    next();
};

exports.setDoctorsUserIds = (req, res, next) => {
    //Allow nested routes
    if (!req.body.doctor) {
        req.body.doctor= req.params.id;
        // console.log(req.body.tour)
    }

    if (!req.body.user) {
        req.body.user = req.user.id;
    }
    next();
};

//*************************************************** */
exports.createReview = catchAsync(async (req, res, next) => {
    const newReview = await reviewModel.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            review: newReview,
        },
    });
});

//***************************************************** */

exports.getAllReview = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.id) {
        filter = { doctotors: req.params.id };
    }

    const Reviews = await reviewModel.find(filter).select("-__v");

    res.status(200).json({
        status: "success",
        result: Reviews.length,
        data: { Reviews },
    });
});
//***************************************************** */

exports.getAllAppReviews = catchAsync(async (req, res, next) => {

    const Reviews = await reviewModel.find().select("-__v");
    const shuffleReviews = await shuffledReviews(Reviews)

    res.status(200).json({
        status: "success",
        result: Reviews.length,
        data: { shuffleReviews },
    });
});

//*****************************************************/

exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await reviewModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    if (!review) {
        return next(new appError(`Can't find this Review`, 404));
    }

    res.status(201).json({
        status: "success",
        data: {
            data: review,
        },
    });
});

//**************************************************************/
exports.deleteReview = catchAsync(async (req, res, next) => {
    //const petId = req.params.id
    const review = await reviewModel.findByIdAndDelete(req.params.id);
    if (!review) {
        return next(new appError("review not found", 400));
    }

    res.status(200).json({
        message: "review deleted successfully",
    });
});

////////////////////////////////////////////////////////////

exports.getMyReviews=catchAsync(async (req, res, next) => {
  

    const Reviews = await reviewModel.find({ user: req.params.id }).select("-__v");

    res.status(200).json({
        status: "success",
        result: Reviews.length,
        data: { Reviews },
    });
});