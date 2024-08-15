import { Schema, model } from 'mongoose';

const rideSchema = new Schema({
  passengerId:  {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
  driverId: { type: Schema.Types.ObjectId,
    ref: 'User' },
  pickupLocation: { 
    type: String,
     required: true },
  destinationLocation: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, default: 'waiting' } // waiting, matched, completed
});


export const Ride = model('Ride', rideSchema);