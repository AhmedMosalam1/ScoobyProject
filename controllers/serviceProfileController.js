const catchAsync = require('express-async-handler');
const seviceProfleModel = require('../Models/serviceProfileModel')
const appError = require("../utils/appError")
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp");
const ServiceProfileModel = require('../Models/serviceProfileModel');


const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new appError('not an image ! please upload only images..', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})


   

exports.serviceProfileImages = (req, res, next) => {
    upload.fields([
        { name: 'imagesProfile', maxCount: 5 },
        { name: 'icon', maxCount: 5 }
        
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Failed to upload files' });
            
        }
        const serviceImageFiles = req.files['icon'];
        const serviceImageFile = serviceImageFiles[0];
        const serviceImageBuffer = await sharp(serviceImageFile.buffer) // Convert to buffer
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer(); // Convert to buffer

        // Upload doctorImage to Cloudinary
        const serviceImageResult = await uploadToClodinary(serviceImageBuffer, serviceImageFile.originalname, 'Scooby/Doctors');
        req.body.icon = serviceImageResult.secure_url;



       
        req.body.imagesProfile = [];

        await Promise.all(
            req.files.imagesProfile.map(async (file, i) => {
                const filename = `serviceProfile-${Date.now()}-${i + 1}.jpeg`;

                const imageBuffer = await sharp(file.buffer)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toBuffer();

                const filePath = `Scooby/ServiceProfile`;
                const result = await uploadToClodinary(imageBuffer, filename, filePath);
               // console.log(result)

                req.body.imagesProfile.push(result.secure_url);
            })
        );

        next();
    });
};

// accepted_pet_types:[{
//     type:String,
//     //enum:['Dogs','Cats']
// }
// ],
// accepted_pet_sizes:[{
//     type:String,
//     //enum:['Dogs','Cats']
// }
// ],
// question1:[{
//     type:String,
    
// }
// ],
// question2:[{
//     type:String,
    
// }
// ],
// question3



//****************************************************************** */
exports.createserviceProfile=catchAsync(async(req,res,next)=>{
    req.body.accepted_pet_types = req.body.accepted_pet_types.split(',').map(coord => (coord.trim()));
    req.body.accepted_pet_sizes = req.body.accepted_pet_sizes.split(',').map(coord => (coord.trim()));
    req.body.question1 = req.body.question1.split(',').map(coord => (coord.trim()));
    req.body.question2 = req.body.question2.split(',').map(coord => (coord.trim()));
    req.body.question3 = req.body.question3.split(',').map(coord => (coord.trim()));

    const newservice=await ServiceProfileModel.create(req.body)
    res.status(201).json({
        status:'success',
        data:newservice
    })

})
/************************************************************** */

exports.getServicesProfile=catchAsync(async(req,res,next)=>{

   

    const serviceProfiles=await ServiceProfileModel.find().populate('reviewsOfService') 
 if(serviceProfiles){
    res.status(200).json({
        status:'success',
          data:serviceProfiles
      })

 }else{
   
        return next(new appError ('empty serviceProfiles', 401))
    
 }
    
  }
    
  
    )




/************************************************************************* */
    const uploadToClodinary = (buffer, filename, folderPath, options = {}) => {
        return new Promise((resolve, reject) => {
            options.folder = folderPath;
    
            options.public_id = filename;
            const uploadStream = cloudinary.uploader.upload_stream(
                options,
                (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            )
            uploadStream.end(buffer)
        })
    }



    //*********************************************************** */
    // exports.updatedoctor = catchAsync(async (req, res, next) => {
    // req.body.specialized_in = req.body.specialized_in.split(',').map(coord => (coord.trim()));
    // req.body.accepted_pet_types = req.body.accepted_pet_types.split(',').map(coord => (coord.trim()));

    
    //     const doctor = await doctormodel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      
    //     if (!doctor) {
    //         return next(new appError(`Can't find this doctor`, 404));
    //     }
      
      
    //     res.status(201).json({
    //         status: "success",
    //         data: {
    //             data: doctor
    //         }
    //     })
    //   })


//********************************************************************** */
exports.getServiceProfile = catchAsync(async (req, res, next) => {

    let doc = await ServiceProfileModel.findById(req.params.id).populate('reviewsOfService')

    if (!doc) {
        return next(new appError(`Can't find doctor on this id`, 404));
    }

    res.status(201).json({doc})
})
