const cloudinary = require('../utils/cloud');


exports.createCloud = async (req,res,next)=>{
    const {image} = req.body;

    try{
        const result = await cloudinary.uploader.upload(image,{
            folder : 'Images',
           // width : 300,
            //crop : "scale"
        })
           // If the upload is successful, send the result (image URL and other metadata) in the response
           return res.status(200).json({
            message: "Image uploaded successfully",
            data: result
        });
    }
    catch(error){
        console.log(error);
        next(error);
    }
}