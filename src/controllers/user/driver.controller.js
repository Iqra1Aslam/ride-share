import { ApiResponse } from '../../utills/ApiResponse.js'
import { asyncHandler } from '../../utills/asyncHandler.js'
import { upload_on_cloudinary } from '../../utills/cloudinary.js'
import { User } from '../../models/user.model.js'
import Joi from 'joi'
import {Driver } from '../../models/driver.model.js'
import {Ride} from '../../models/ride.model.js'
export const driver = {
    driver_info: asyncHandler(async (req, res) => {
        const { cnic, driver_id_confirmation, driver_is_verified,currentLocation} = req.body
        const driverValidationSchema = Joi.object({
            // driver: Joi.string().required(), // Assuming a string representation of the ObjectId
           cnic: Joi.string().required(),
            // driver_id_confirmation:Joi.string().required(),
           currentLocation:Joi.string().required(),

        })
        const { error } = driverValidationSchema.validate(req.body)
        if (error) return res.status(400).json(new ApiResponse(error.code || 400, error, error.message))
        const newDriver = await Driver.create({ cnic,currentLocation })
        return res.status(201).json(new ApiResponse(201, { newDriver }, 'driver created successfully'))
    }),
     driver_lisence_image_add: asyncHandler(async (req, res) => {
      const user_id = req.user_id
      const image = req.file
      const   driver_lisence_image = await upload_on_cloudinary(image)
      // check inside driver_lisence_image exist url or not
     
      const user = await driver.findByIdAndUpdate(
          user_id,
          {   driver_lisence_image:driver_lisence_image?.url }
      )
      res.status(200).json(new ApiResponse(200, {}, 'driver_lisence_image updated'))
     
  }),
  driver_is_verified:asyncHandler(async(req,res)=>{
     // get user_id from req which passed from middleware
     const user_id = req.user_id
     // get (is_driver_verified) from body
  const {is_driver_verified}=req.body
      const driverValidationSchema=Joi.object({
        is_driver_verified:Joi.boolean().required()     
  })
  const {error}=driverValidationSchema.validate(req.body)
  if(error)
      return res.status(400).json(new ApiResponse(error.code || 400, error, error.message))
  const driver = await driver.create({is_driver_verified})
      return res.status(200).json(new ApiResponse(200,{},'driver info about verification added'))

  }),
  fetch_ride:asyncHandler(async(req,res)=>{
    const passengers = await Ride.find({ status: 'waiting' });
  res.json(passengers);
  }),
  select_ride:asyncHandler(async(req,res)=>{
    c
  


    // Validate ObjectId format
    // if (!mongoose.Types.ObjectId.isValid(passengerId) || !mongoose.Types.ObjectId.isValid(driverId)) {
    //   return res.status(400).json({ message: 'Invalid passengerId or driverId' });
    // }
  
    // Find the passenger's ride by ID
    const ride = await Ride.findById(passengerId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
  
    // Check if the ride status is 'waiting'
    if (ride.status !== 'waiting') {
      return res.status(400).json({ message: 'Passenger already matched or completed' });
    }
  
    // Update the ride status to 'matched'
    ride.status = 'matched';
    // ride.driverId = mongoose.Types.ObjectId(driverId); // Assign the driverId
    await ride.save();
  
    return res.status(200).json({ message: 'Ride matched successfully', ride });
  
  }),
  
    driver_verification: asyncHandler(async (req, res) => {
        const { is_verified } = req.body;
        const user_id = req.user_id;

        const driver = await Driver.findOneAndUpdate(
            { driver: user_id },
            { is_driver_verified: is_verified },
            { new: true }
        );

        if (!driver) {
            return res.status(404).json(new ApiResponse(404, {}, 'Driver not found.'));
        }

        res.status(200).json(new ApiResponse(200, { driver }, 'Driver verification status updated successfully'));
    }),
    driver_details_add: asyncHandler(async (req, res) => {
      const user_id = req.user_id;
      // const user_id = req.params.id.trim();
      const { name, phone, cnic } = req.body;
  
     try{
          const driver = await Driver.findByIdAndUpdate(
              user_id,
              { 
                  name: name,
                  phone: phone,
                  cnic: cnic 
              },
              { new: true,upsert: true}
          );
        } catch (error) {
          res.status(500).json({ success: false, message: "Failed to add driver details" });
      }

        res.status(200).json(new ApiResponse(200, { driver }, 'Driver  status updated successfully'));
    }),

// Endpoint to update driver's location
 driver_location :  asyncHandler(async (req, res) => {
    const { driverId, latitude, longitude } = req.body;
    const user_id = req.user_id
    try {
        await Driver.findByIdAndUpdate(user_id, {
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });
        res.status(200).send({ success: true, message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error updating location', error: error.message });
    }
}),

}


