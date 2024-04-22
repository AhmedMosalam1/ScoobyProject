const catchAsync = require('express-async-handler');
const doctormodel = require('../Models/doctorModel')
const appError = require("../utils/appError")
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")


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

 //exports.uploadPhoto = upload.single('doctorImage')
// exports.doctorImages = upload.fields([
//     { name: 'doctorImage', maxCount: 1 },
//    // { name: 'imagesProfile', maxCount: 5 }
//   ]);

   

exports.doctorImages = (req, res, next) => {
    // Upload doctorImage
    upload.fields([
        { name: 'doctorImage', maxCount: 1 },
        { name: 'imagesProfile', maxCount: 5 }
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Failed to upload files' });
        }

        const doctorImageFiles = req.files['doctorImage'];

        // Check if doctorImage file is present
        // if (!doctorImageFiles || doctorImageFiles.length === 0) {
        //     return res.status(400).json({ error: 'doctorImage file is required' });
        //     next()
        // }

        // Process doctorImage
        // if(req.files['doctorImage']){
        //     const doctorImageFile = doctorImageFiles[0];
        // const doctorImageBuffer = await sharp(doctorImageFile.buffer) // Convert to buffer
        //     .toFormat('jpeg')
        //     .jpeg({ quality: 90 })
        //     .toBuffer(); // Convert to buffer

        // // Upload doctorImage to Cloudinary
        // const doctorImageResult = await uploadToClodinary(doctorImageBuffer, doctorImageFile.originalname, 'Scooby/Doctors');
        // req.body.doctorImage = doctorImageResult.secure_url;

        // }
        const doctorImageFile = doctorImageFiles[0];
        const doctorImageBuffer = await sharp(doctorImageFile.buffer) // Convert to buffer
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer(); // Convert to buffer

        // Upload doctorImage to Cloudinary
        const doctorImageResult = await uploadToClodinary(doctorImageBuffer, doctorImageFile.originalname, 'Scooby/Doctors');
        req.body.doctorImage = doctorImageResult.secure_url;
      
        req.body.imagesProfile = [];

        await Promise.all(
            req.files.imagesProfile.map(async (file, i) => {
                const filename = `doctor-${Date.now()}-${i + 1}.jpeg`;

                const imageBuffer = await sharp(file.buffer)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toBuffer();

                const filePath = `Scooby/Doctors`;
                const result = await uploadToClodinary(imageBuffer, filename, filePath);
               // console.log(result)

                req.body.imagesProfile.push(result.secure_url);
            })
        );

        next();
    });
};



//****************************************************************** */
exports.createdoctor=catchAsync(async(req,res,next)=>{
    //specialized_in:[
    //     String
    // ],
    // accepted_pet_types
    req.body.specialized_in = req.body.specialized_in.split(',').map(coord => (coord.trim()));
    req.body.accepted_pet_types = req.body.accepted_pet_types.split(',').map(coord => (coord.trim()));

    const newdoctor=await doctormodel.create(req.body)
    res.status(201).json({
        status:'success',
        data:newdoctor
    })

})
/************************************************************** */

exports.getdoctors=catchAsync(async(req,res,next)=>{

   

    const doctors=await doctormodel.find()   
 if(doctors){
    res.status(200).json({
        status:'success',
          data:doctors
      })

 }else{
   
        return next(new appError ('empty doctors', 401))
    
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
    exports.updatedoctor = catchAsync(async (req, res, next) => {
    req.body.specialized_in = req.body.specialized_in.split(',').map(coord => (coord.trim()));
    req.body.accepted_pet_types = req.body.accepted_pet_types.split(',').map(coord => (coord.trim()));

    
        const doctor = await doctormodel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      
        if (!doctor) {
            return next(new appError(`Can't find this doctor`, 404));
        }
      
      
        res.status(201).json({
            status: "success",
            data: {
                data: doctor
            }
        })
      })


//********************************************************************** */
exports.getDoctor = catchAsync(async (req, res, next) => {

    let doc = await doctormodel.findById(req.params.id).populate('reviewsOfDoctor')

    if (!doc) {
        return next(new appError(`Can't find doctor on this id`, 404));
    }

    res.status(201).json({
        status: "success",
        
        data: {
            data: doc,
            reviewsofDctors:doc.reviewsOfDoctor.length,
        }
    })
})
