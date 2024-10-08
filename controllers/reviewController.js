const User = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const serviceProfileModel=require('../Models/serviceProfileModel')
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
//*************************************************/
exports.setShelterUserIds = (req, res, next) => {
    //Allow nested routes
    if (!req.body.shelter) {
        req.body.shelter = req.params.id;
        // console.log(req.body.tour)
    }

    if (!req.body.user) {
        req.body.user = req.user.id;
    }
    next();
};

//*************************************************** */
// exports.createReview = catchAsync(async (req, res, next) => {
//     const newReview = await reviewModel.create(req.body);
//     res.status(201).json({
//         status: "success",
//         data: {
//             review: newReview,
//         },
//     });
// });

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
// exports.deleteReview = catchAsync(async (req, res, next) => {
//     //const petId = req.params.id
//     const review = await reviewModel.findByIdAndDelete(req.params.id);
//     if (!review) {
//         return next(new appError("review not found", 400));
//     }

//     res.status(200).json({
//         message: "review deleted successfully",
//     });
// });




////////////////////////////////////////////////////////////

exports.getMyReviews=catchAsync(async (req, res, next) => {
     

    const userid=req.user.id
    const Reviews = await reviewModel.find({ user: userid }).select("-__v");
    

    res.status(200).json({
        status: "success",
        result: Reviews.length,
        data: { Reviews },
    });
});













//****************************************************************/
exports.createReviewSerivce = catchAsync(async (req, res, next) => {
   
        
        const serviceId = req.params.id;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return next(new appError(`Can't find User on this id`, 404));

        }
        if (!req.body.service) {
            req.body.service =serviceId ;
            // console.log(req.body.tour)
        }
    
        const newReview = await reviewModel.create(req.body);
       
        res.status(201).json({newReview})
        next();


       

    }
)

//************************************************************/
exports.createReviewDoctor = catchAsync(async (req, res, next) => {
   
        
    const doctorId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        return next(new appError(`Can't find User on this id`, 404));

    }
    if (!req.body.doctor) {
        req.body.doctor =doctorId ;
        // console.log(req.body.tour)
    }

    const newReview = await reviewModel.create(req.body);
   
    res.status(201).json({newReview})
    next();


   

}
)

//********************************************************/
exports.createReviewShelter = catchAsync(async (req, res, next) => {
   
        
    const shelterId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        return next(new appError(`Can't find User on this id`, 404));

    }
    if (!req.body.shelter) {
        req.body.shelter =shelterId ;
        // console.log(req.body.tour)
    }

    const newReview = await reviewModel.create(req.body);
   
    res.status(201).json({newReview})
    next();


   

}
)


///************************************************** */
exports.deleteReview =catchAsync(async (req, res, next) => {
        //const petId = req.params.id
        try {
            // Find the review by ID and delete it
            const deletedReview = await reviewModel.findByIdAndDelete(req.params.id);
            
            if (!deletedReview) {
                return res.status(404).json({ message: 'Review not found' });
            }
    
            // Decrement the number of rates
            await serviceProfileModel.findByIdAndUpdate(deletedReview.service, {
                $inc: { numberOfRate: -1 } // Decrement by 1
            });
    
            res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
            next(error); // Pass the error to the error handling middleware
        }
    });

   exports.getReviewsUser=catchAsync(async (req, res, next) => {
     

    const userid=req.params.id
    const Reviews = await reviewModel.find({ user: userid }).select("-__v");
    

    res.status(200).json({
        status: "success",
        result: Reviews.length,
        data: { Reviews },
    });
});
