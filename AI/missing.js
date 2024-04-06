const axios = require('axios');
const catchAsync = require("express-async-handler");
const appError = require("../utils/appError")
const cloudinary = require("../utils/cloud")

//------------------------------------------------------------- classification
async function getClassificationResult(imageUrl) {
    try {
        const response = await axios.get(`https://scoopy-ai-api.onrender.com/clssification?image=${encodeURIComponent(imageUrl)}`);
        return response.data;
    } catch (error) {
        return new appError('Error in classification function')
    }
}
//------------------------------------------------------------- similarity
async function getSimilarityDistance(file1Url, file2Url) {
    try {
        const response = await axios.get(`https://scoopy-ai-api.onrender.com/distance?file1=${encodeURIComponent(file1Url)}&file2=${encodeURIComponent(file2Url)}`);
        return response.data;
    } catch (error) {
        return new appError('Error in similarity function')
    }
}
//------------------------------------------------------------- get founded pets
cloudinary.config({ 
    cloud_name: 'dtny7jzz1', 
    api_key: '483257938298228', 
    api_secret: 'p3M8L2MC4VTpYo0IVXWQV7lf2XA' 
});

// let foundedPets;

// cloudinary.api.resources({ type: 'upload', prefix: 'Scooby/Missing/Founded' }, async function (error, result,next) {
//     if (error) {
//         return next(new appError('Error in downloading founded pets images', 404))
//     } else {
//         const imageUrl = 'https://res.cloudinary.com/dtny7jzz1/image/upload/v1712336294/Scooby/Missing/Founded/wtjwuaapaggdk2cspb8g.jpg';
//         foundedPets = result.resources.map(obj => obj.secure_url);
//         // console.log('----------')
//         // const y = foundedPets[1] ;
//         // //const x = req.query.image
//         // //const z = await getClassificationResult(x)
//         // //console.log(z)
//         // console.log('----------')
//     }
// });

//------------------------------------------------------------- Missing
exports.missing = catchAsync(async (req, res, next) => {
    console.log('--------------------');
    const imageUrl = req.query.image;
    console.log(imageUrl)
    const classificationResult = await getClassificationResult(imageUrl);
    console.log(classificationResult.Calss)
    console.log('--------------------');
    if (classificationResult.Calss) {
        return next(new appError('Please Enter image again', 404));
    } else if (classificationResult.Calss === 'other') {
        return next(new appError('Please send an image of a dog or cat only, or try entering another image ', 404));
    } else {
        try {
            cloudinary.api.resources({ type: 'upload', prefix: 'Scooby/Missing/Founded' }, async function (error, result) {
                if (error) {
                    return next(new appError('Error in downloading founded pets images', 404));
                } else {
                    foundedPets = result.resources.map(obj => obj.secure_url);
                    console.log(foundedPets)
                    console.log('--------------------')
                    // const similarity = await getSimilarityDistance(imageUrl,imageUrl);
                    // console.log(similarity)
                    const similarityArray = foundedPets.map(async image => {
                            const similarity = await getSimilarityDistance(imageUrl,image);
                            console.log(image)
                            return { similarity, url: image };
                        })
                    console.log('--------------------');
                    console.log(similarityArray);
                    res.status(200).json({ similarityArray });
                    console.log('--------------------');
                }
            });
        } catch (err) {
            return next(new appError('Error in processing the request', 500));
        }
    }
});


//module.exports = missing
// const imageUrl = 'https://res.cloudinary.com/dtny7jzz1/image/upload/v1712336294/Scooby/Missing/Founded/wtjwuaapaggdk2cspb8g.jpg';
// let x= await getSimilarityDistance(imageUrl,imageUrl)
// console.log(x)