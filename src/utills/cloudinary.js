import {v2 as cloudinary} from 'cloudinary'
import { config } from 'dotenv'
const cloudinary_config=cloudinary.config({
    cloud_name: 'dpps9rw7d', 
    api_key: '676336584515987', 
    api_secret: 'A23Xv6rpTFfZg_7FVPt_MEBsgcQ'
})
export const upload_on_cloudinary=async(file)=>{
    try{
const file_data=await cloudinary.uploader.upload(file)
.then(info=>{
    console.log(info.url)
    return info.url
})
 
    .catch (error=>{
        console.log(error.message)
        return error.message
    })
}
    catch (error){
        console.log(error.message)
}
}
export const upload_multiple_on_cloudinary = async (files) => {
    try {
        const uploaded_files = files.map(async (file) => (
            await cloudinary.uploader.upload(file)
        ))
        const result = await Promise.all(uploaded_files)
        console.log(result)
        return result.map(file => file.url)

    } catch (error) {
        console.log(error.message)
    }
}