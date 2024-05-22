const {Schema,model}= require('mongoose') 
const bcrypt = require('bcryptjs');

const userSchema= new Schema ({

    name:{
        type:String,
        required:[true,'User name is required'],
        trim:true,
        minlength:[3,'User name can be minimun 3 characters'],
        mixlength:[31,'User name can be maximum 31 characters'],

    },
//  email:{
//         type:String,
//         required:[true,'User email is required'],
//         trim:true,
//         unique:true,
//         lowercase:true,
//         validate:{
//             validator: (v)=>{
//                 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//             },
//             message:'Please inter a valid email'
//         }

//     },

email: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Please enter a valid email',
    },
  },

    password:{
        type:String,
        required:[true,'User password is required'],
        minlength:[6,'User password can be minimun 6 characters'],

        set:(v)=> bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },

    image:{
        type:Buffer,
        contentType:String,
        required:[true,' User Image is required'],
     },
    
    address:{
        type:String,
        required:[true,'User address is required'],
        minlength:[3,'User address can be minimun 3 characters'],
    } ,

    phone:{
        type:String,
        required:[true,'User phone  is required'],
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
     isBanned:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})

const User = model('User',userSchema)

module.exports= User
