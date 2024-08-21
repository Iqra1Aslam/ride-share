// import { Schema, model } from 'mongoose';

// const rideSchema = new Schema({
//   passengerId:  {
//     type: Schema.Types.ObjectId,
//     ref: 'User'
// },
//   driverId: { type: Schema.Types.ObjectId,
//     ref: 'User' },
//   pickupLocation: { 
//     type: String,
//      required: true },
//   destinationLocation: { type: String, required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },
//   status: { type: String, default: 'waiting' } // waiting, matched, completed
// });

import { Schema, model } from 'mongoose';

const rideSchema = new Schema({
  passengerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  pickup_location: {
   
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }
  },
  dropLocation: {
   
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }
  
  },
  date:{
    type:String,
    required: true
  },
  starttime: {
    type: Date,
    required: true
  },
  endtime: {
    type: Date,
    required: true
  },
  numSeats: {
    type: Number,
    required: true,
  },
  pricePerSeat: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'matched', 'completed'],
    default: 'waiting'
  } // waiting, matched, completed
});

rideSchema.index({ pickup_location: '2dsphere' });

export const Ride = model('Ride', rideSchema);