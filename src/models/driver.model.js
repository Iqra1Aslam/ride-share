import { Schema, model } from 'mongoose';

const vehicle_schema = new Schema({
        rider: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        vehicle_company: {
            type: String
        },
        vehicle_location:{
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
              },
              coordinates: {
                type: [Number],
                required: true,
              },
             },
        
        vehicle_color: {
            type: String
        },
        vehicle_model: {
            type: String
        },
        vehicle_number: {
            type: String
        },
        vehicle_image: {
            type: String
        },
        vehicle_dox_image: {
            type: String
        },
        is_vehicle_verified: {
            type: Boolean,
            default:false
        }},
{
    timestamps: true
});

const rider_schema = new Schema({
        rider: {
            type: Schema.Types.ObjectId, 
            ref: 'User' 
        },
        cnic: {
            type:String
        },
        rider_lisence_image:{
            type:String
        },
        rider_id_confirmation: {
            type:String

        },
        is_rider_verified: {
            type: Boolean,
            default: false
        }
    
},{timestamps: true})

// vehicle_schema.index({vehicle_location: '2dsphere' });
export const Vehicle = model('Vehicle', vehicle_schema);
export const Rider = model('Rider', rider_schema);