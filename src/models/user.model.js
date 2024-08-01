import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        full_name: {
            type: String
        },
        profile_image: {
            type: String,
            default: 'https://shorturl.at/mpFGT'
        },
        role: {
            type: String,
            enum: ['rider', 'passenger', 'admin'],
            default: 'passenger'
        },
        phone_number: {
            type: String
        },
        email: {
            type: String
        },
        address: {
            type: String
        },
        location: {
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
        
        city: {
            type: String
        },
        is_verified: {
            type: Boolean,
            default: false
        },
        is_admin: {
            type: Boolean,
            default: false
        },
        password: {
            type: String
        }
    },
    {
        timestamps: true
    })
    userSchema.pre('save', async function (next) {
        // The this keyword refers to the current object in a method or constructor. The most common use of 
        // the this keyword is to eliminate the confusion between class attributes and parameters with the same name 
        if (!this.isModified('password')) return next()
        this.password = await bcrypt.hash(this.password, 8)
    })
    
    userSchema.methods.is_password_correct = async function (password) {
       
        return await bcrypt.compare(password, this.password)
    }
    userSchema.index({ location: '2dsphere' });
export const User = model('User', userSchema)