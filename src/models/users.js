const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const task = require('../models/task')
const userScheme = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim: true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        lowercase :true,
        trim : true,
        
        validate(value){
            if(!validator.isEmail(value)){

                throw new Error("Invalid Email!")
            }
        }
    },
    age :{
        type : Number,
        default : 0,
        validate(value){
            if(value < 0){

                throw new Error('Age Must Be Positive Number!') 
            }
        }
    },
    passwords : {
            type : String,
            trim : true,
            required: true,
            minlength : 6,

            validate(value){
                
                if(value.toLowerCase().includes('password')){

                    throw new Error('Password Should Not Containt "password"')
                }
            }
    },
    tokens : [{
        token : {
            type : String,
            required :true
        }

    }],
    avatar : {
        type : Buffer
    }
   
},
{
    timestamps : true
})

userScheme.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
    
})

userScheme.methods.getAuthMethod = async function (){
    const user = this
    const token = await jwt.sign({ _id : user._id.toString()}, process.env.jwt_secret)
    user.tokens = user.tokens.concat( { token })
    await user.save()
    return token
}
userScheme.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.passwords
    delete userObject.tokens
    delete userObject.avatar
    
        return userObject  
}
userScheme.statics.findByCredit = async (email,passwords) => {
    const user = await User.findOne({email})
    if (!user){
        throw new Error('Unable To login!')
    }
    const Imatch = await bcrypt.compare(passwords,user.passwords)

    if(!Imatch){

        throw new Error('Unable To login!')
    }
     return user
}


userScheme.pre('save',async function(next) {
    const user = this
    if(user.isModified('passwords')){

        user.passwords = await bcrypt.hash(user.passwords,8)
    }

    next()
})
userScheme.pre('remove',async function(next) {
    const user = this
    await task.deleteMany({ owner : user._id})
    next()
    
})
const User = mongoose.model('User',userScheme)
module.exports = User