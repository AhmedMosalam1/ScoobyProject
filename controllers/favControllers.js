const User = require("../Models/userModel")
const catchAsync = require('express-async-handler');
const appError = require("../utils/appError")

exports.addFav = catchAsync(async (req, res, next) => {

    if (req.query.productId) {
        const productId = req.query.productId;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return next(new appError(`Can't find User on this id`, 404));
        }

        const isProductFav = user.favProduct.includes(productId);

        if (isProductFav) {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $pull: { favProduct: productId },
                },
                { new: true }
            );

            return res.status(200).json({
                status: 'success',
                message: 'Product removed successfully from your favlist.',
                data: updatedUser.favProduct,
            });
        } else {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { favProduct: productId },
                },
                { new: true }
            );

            return res.status(200).json({
                status: 'success',
                message: 'Product added successfully to your favlist.',
                data: updatedUser.favProduct,
            });
        }
    } else if (req.query.petId) {
        const petId = req.query.petId;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return next(new appError(`Can't find User on this id`, 404));
        }

        const isPetFav = user.favPet.includes(petId);

        if (isPetFav) {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $pull: { favPet: petId },
                },
                { new: true }
            );

            return res.status(200).json({
                status: 'success',
                message: 'Pet removed successfully from your petlist.',
                data: updatedUser.favPet,
            });
        } else {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { favPet: petId },
                },
                { new: true }
            );

            return res.status(200).json({
                status: 'success',
                message: 'Pet added successfully to your petlist.',
                data: updatedUser.favPet,
            });
        }
    }

});


exports.getFavProduct = catchAsync(async (req, res, next) => {

        const user = await User.findById(req.user.id).populate('favProduct');

        return res.status(200).json({
            status: 'success',
            data: user.favProduct,
        });
   
});

exports.getFavPet = catchAsync(async (req, res, next) => {
        const user = await User.findById(req.user.id).populate('favPet');

        return res.status(200).json({
            status: 'success',
            data: user.favPet,
        });
});




