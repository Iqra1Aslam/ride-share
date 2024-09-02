import {model,Schema} from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        full_name:{
            type: String
        },
        profile_image:{
            type: String,
            required:false,
            default: 'https://l1nk.dev/MTZj7'
        },
        role:{
            type: String,
            enum:['rider','passenger','admin'],
            default: 'passenger'

        },
        phone_no:{
            type: Number
        },
        email:{
            type: String
        },
        address:{
            type: String
        },
        city:{
            type: String
        },
        is_verified:{
            type: Boolean,
            default: false
        },
        is_admin:{
            type: Boolean,
            default: false
        },
        password:{
            type: String
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires:{
            type:  Date
        },
        newPassword:{
            type: String
        }
    },
    {
        timestamps: true
    }
)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 8)
})

userSchema.methods.is_password_correct = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = model('User',userSchema)