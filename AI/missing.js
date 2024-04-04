// Function to get classification result
const axios = require('axios');
const catchAsync = require("express-async-handler");

async function getClassificationResult(imageUrl) {
    try {
        const response = await axios.get(`https://scoopy-ai-api.onrender.com/clssification?image=${encodeURIComponent(imageUrl)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classification result:', error);
        throw error;
    }
}

// Function to get similarity distance between two images
async function getSimilarityDistance(file1Url, file2Url) {
    try {
        const response = await axios.get(`https://scoopy-ai-api.onrender.com/distance?file1=${encodeURIComponent(file1Url)}&file2=${encodeURIComponent(file2Url)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching similarity distance:', error);
        throw error;
    }
}

exports.missing =catchAsync(async (req, res,next) => {
  try {
      const imageUrl = req.query.image;
     const file1Url = req.query.file1;
      const file2Url = req.query.file2;

      const classificationResult = await getClassificationResult(imageUrl);
      const similarityDistance = await getSimilarityDistance(imageUrl, file2Url);

     // res.json({ classificationResult, similarityDistance });
     console.log(classificationResult)
     console.log(similarityDistance)
      if(classificationResult){
      res.status(200).json({
          status:'success',
            data:{classificationResult,similarityDistance}
        })

      //   if(similarityDistance)(
      //     res.status(200).json({
      //         status:'success',
      //           data:similarityDistance
      //       })


        //)
       // console.log(classificationResult)
       // console.log(similarityDistance)

     next()
  }
}catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'An error occurred' });
  }
})

//module.exports = missing