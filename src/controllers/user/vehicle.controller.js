import { ApiResponse } from '../../utills/ApiResponse.js'
import { asyncHandler } from '../../utills/asyncHandler.js'
import { upload_multiple_on_cloudinary } from "../../utills/cloudinary.js";
import Joi from 'joi';
import {Vehicle } from '../../models/driver.model.js';
import { Driver } from '../../models/driver.model.js';
import { Ride } from '../../models/ride.model.js'

export const vehicle = {
    vehicle_info: asyncHandler(async (req, res) => {
        const { car_type, vehicle_model, vehicle_plate_number, number_of_seats, vehicle_location, vehicle_color } = req.body;
        const driver = req.user_id;
        // Validation schema
        const vehicle_validationSchema = Joi.object({
            car_type: Joi.string().required(),
            vehicle_model: Joi.string().required(),
            vehicle_plate_number: Joi.string().required(),
            number_of_seats: Joi.number().integer().min(1).required(),
            vehicle_location: Joi.object({
                type: Joi.string().valid('Point').required(),
                coordinates: Joi.array().items(
                    Joi.number().min(-180).max(180), // Longitude
                    Joi.number().min(-90).max(90)    // Latitude
                ).length(2).required()
            }).required(),
            vehicle_color: Joi.string().required()
        });

        // Validate the request body
        const { error } = vehicle_validationSchema.validate(req.body);
        if (error) return res.status(400).json(new ApiResponse(400, error, error.message));

        // Create a new vehicle entry
        const vehicle = new Vehicle({
            driver,
            car_type,
            vehicle_model,
            vehicle_plate_number,
            number_of_seats,
            vehicle_location,
            vehicle_color
        });

        // Save the vehicle entry
        await vehicle.save();

        // Send response
        return res.status(201).json(new ApiResponse(201, { vehicle }, 'Vehicle details added successfully'));
    }),

    vehicle_images_upload: asyncHandler(async (req, res) => {
        const { vehicle_image, vehicle_dox_image } = req.files
        const user_id = req.user_id
        const images = [
            vehicle_image[0].path,
            vehicle_dox_image[0].path
        ]
        const uploaded_images = await upload_multiple_on_cloudinary(images)
        console.log(`uploaded_images: ${uploaded_images}`)
        const vehicle = await Vehicle.findByIdAndUpdate(user_id, { vehicle_image: uploaded_images[0].url, vehicle_dox_image: uploaded_images[1].url }, { new: true })

        res.status(201).json(new ApiResponse(201, vehicle, 'vehicle info added successfully', true))
    }),
  
    is_verified:asyncHandler(async(req,res)=>{
        const { is_verified } = req.body;
        const { vehicleId } = req.params;

        const vehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            { is_verified: is_verified },
            { new: true }
        );

        if (!vehicle) {
            return res.status(404).json(new ApiResponse(404, {}, 'Vehicle not found.'));
        }

        res.status(200).json(new ApiResponse(200, { vehicle }, 'Vehicle verification status updated successfully'));
    }),
     publish_ride: asyncHandler(async (req,res)=>{
    const { pickup_location, dropLocation, time,numSeats, pricePerSeat } = req.body
    const driverId = req.user_id;

    // Validate the input
    if (!pickup_location || !dropLocation ||  !time ||  !numSeats || !pricePerSeat) {
        return res.status(400).json(new ApiResponse(400, 'All fields are required'))
    }
    // Create a new ride offer
    const ride = new publishRide({
        pickup_location,
        dropLocation,
        time,
        numSeats,
        pricePerSeat,
        status: 'waiting',
        driverId: driverId 
        
    });
     // Check if the ride status is 'waiting'
if (ride.status !== 'waiting') {
    return res.status(400).json({ message: 'Ride is already matched or completed' });
  }

  // Save the ride to the database
     await ride.save();

    return res.status(201).json(new ApiResponse(201,{ride},'Ride created successfully'))
    
}),
    is_nearestVehicle:asyncHandler(async(req,res)=>{
        try {
          const { passengerLocation, requestedTime } = req.body;
      
          // Convert requestedTime to a Date object
          const requestedDate = new Date(requestedTime);
      
          // Calculate the time range: 15 minutes before and after the requested time
          const timeBefore = new Date(requestedDate);
          timeBefore.setMinutes(requestedDate.getMinutes() - 15);
      
          const timeAfter = new Date(requestedDate);
          timeAfter.setMinutes(requestedDate.getMinutes() + 15);
      
          // Debug logs
          console.log('Passenger Location:', passengerLocation);
          console.log('Time Range:', timeBefore, timeAfter);
      
          // Find nearby rides within 5km and within the specified time range
          const nearbyRides = await Ride.aggregate([
            {
              $geoNear: {
                near: {
                  type: 'Point',
                  coordinates: [parseFloat(passengerLocation.longitude), parseFloat(passengerLocation.latitude)],
                },
                distanceField: 'distance',
                maxDistance: 5000, // 5km radius
                spherical: true,
                key: 'pickup_location', // Geospatial index field
              },
            },
            {
              $match: {
                starttime: {
                  $gte: timeBefore,
                  $lte: timeAfter,
                },
              },
            },
          ]);
      
          console.log('Nearby Rides:', nearbyRides);
      
          if (nearbyRides.length === 0) {
            return res.status(404).json({ message: 'No rides found nearby' });
          }
      
          res.json(nearbyRides);
        } catch (err) {
          console.error('Error finding nearby rides:', err);
          res.status(500).json({ error: 'Failed to find nearby rides' });
        }
      
      
}),
publish_ride: asyncHandler(async (req, res) => {

    const { pickup_location, dropLocation, date, starttime, endtime, numSeats, pricePerSeat } = req.body;
    const driverId = req.user_id;  // Assuming user ID is stored in req.user_id

    // Validate the input
    if (!pickup_location || !dropLocation || !date || !starttime || !endtime || !numSeats || !pricePerSeat) {
        return res.status(400).json(new ApiResponse(400, 'All fields are required'));
    }

    // Validate date format (Sat Aug 24 2024)
    // isNaN(Not a Number)(dateObj.getTime()) expression evaluates to true
    //  if dateObj.getTime() returns a non-numeric value, which means dateObj is not a valid Date object.
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return res.status(400).json(new ApiResponse(400, 'Invalid date format. Use "Sat Aug 24 2024".'));
    }

    // Validate time format (HH:MM AM/PM)
    const timeRegex = /^(\d{1,2}:\d{2})(\s?[APap][Mm])?$/;
    if (!timeRegex.test(starttime) || !timeRegex.test(endtime)) {
        return res.status(400).json(new ApiResponse(400, 'Invalid time format. Use HH:MM AM/PM.'));
    }

    // Combine the date and time into Date objects
    const startTimeString = `${date} ${starttime}`;
    const endTimeString = `${date} ${endtime}`;
    const startTimeObj = new Date(startTimeString);
    const endTimeObj = new Date(endTimeString);

    // Validate the parsed Date objects
    if (isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())) {
        return res.status(400).json(new ApiResponse(400, 'Invalid start or end time.'));
    }

    // Create a new ride offer
    const ride = new Ride({
        pickup_location,
        dropLocation,
        date: dateObj,
        starttime: startTimeObj,
        endtime: endTimeObj,
        numSeats,
        pricePerSeat,
        status: 'waiting',
        driverId: driverId
    });

    // Save the ride to the database
    await ride.save();

    // Format date and time for the response
    const formattedDate = dateObj.toDateString(); // Sat Aug 24 2024
    const formattedStartTime = startTimeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
    const formattedEndTime = endTimeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    return res.status(201).json(new ApiResponse(201, {
        ride: {
            ...ride.toObject(),
            date: formattedDate,
            starttime: formattedStartTime,
            endtime: formattedEndTime
        }
    }, 'Ride created successfully'));
})


//   const { pickup_location, dropLocation, date, starttime, endtime, numSeats, pricePerSeat } = req.body;
// const driverId = req.user_id;

// // Validate the input
// if (!pickup_location || !dropLocation || !date || !starttime || !endtime || !numSeats || !pricePerSeat) {
//     return res.status(400).json(new ApiResponse(400, 'All fields are required'));
// }

// // Create a new ride offer
// const ride = new Ride({
//     pickup_location,
//     dropLocation,
//     date,
//     starttime,
//     endtime,
//     numSeats,
//     pricePerSeat,
//     status: 'waiting',
//     driverId: driverId
// });

// Save the ride to the database
// await ride.save();

// return res.status(201).json(new ApiResponse(201, { ride }, 'Ride created successfully'));


    
}