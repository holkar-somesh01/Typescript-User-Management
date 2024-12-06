import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config();

// const cloudinary = cloudinaryV2.v2
cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
    cloud_name: process.env.CLOUD_NAME as string,
})

export default cloudinary