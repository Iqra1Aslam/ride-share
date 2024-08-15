import { ApiResponse } from '../../utills/ApiResponse.js'
import { asyncHandler } from '../../utills/asyncHandler.js'
import { Ride } from '../../models/ride.model.js';
// Post a Ride Request
export const ride = {
     ride_info: asyncHandler(async (req, res) => {
        const user_id = req.user_id
        const {  pickupLocation, destinationLocation, startTime, endTime } = req.body;
        
        const newRide = await Ride.create({ 
            user_id,
          pickupLocation,
          destinationLocation,
          startTime,
          endTime,
          status: 'waiting'
         })

        // create jwt token (user id) 
      

        // send response
        return res.status(201).json(new ApiResponse(201, { newRide }, 'ride request created successfully'))
    }),
}
  