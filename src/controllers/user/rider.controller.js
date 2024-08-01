import { ApiResponse } from '../../utills/ApiResponse.js'
import { asyncHandler } from '../../utills/asyncHandler.js'
import { upload_on_cloudinary } from '../../utills/cloudinary.js'
import { User } from '../../models/user.model.js'
import Joi from 'joi'
import {Rider } from '../../models/driver.model.js'

export const rider = {
    rider_info: asyncHandler(async (req, res) => {
        const { cnic, user_id_confirmation, rider_is_verified } = req.body
        const riderValidationSchema = Joi.object({
            // rider: Joi.string().required(), // Assuming a string representation of the ObjectId
           cnic: Joi.string().required(),
          user_id_confirmation:Joi.string().required(),
         

        })
        const { error } = riderValidationSchema.validate(req.body)
        if (error) return res.status(400).json(new ApiResponse(error.code || 400, error, error.message))
        const rider = await Rider.create({ cnic,user_id_confirmation,rider_is_verified })
        return res.status(201).json(new ApiResponse(201, { rider }, 'rider created successfully'))
    }),
     rider_lisence_image_add: asyncHandler(async (req, res) => {
      const user_id = req.user_id
      const image = req.file
      const   rider_lisence_image = await upload_on_cloudinary(image)
      // check inside rider_lisence_image exist url or not
     
      const user = await Rider.findByIdAndUpdate(
          user_id,
          {   rider_lisence_image:rider_lisence_image?.url }
      )
      res.status(200).json(new ApiResponse(200, {}, 'rider_lisence_image updated'))
     
  }),
  rider_is_verified:asyncHandler(async(req,res)=>{
     // get user_id from req which passed from middleware
     const user_id = req.user_id
     // get (is_rider_verified) from body
  const {is_rider_verified}=req.body
      const riderValidationSchema=Joi.object({
        is_rider_verified:Joi.boolean().required()     
  })
  const {error}=riderValidationSchema.validate(req.body)
  if(error)
      return res.status(400).json(new ApiResponse(error.code || 400, error, error.message))
  const rider = await Rider.create({is_rider_verified})
      return res.status(200).json(new ApiResponse(200,{},'rider info about verification added'))

  })
}

