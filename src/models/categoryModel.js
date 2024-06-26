const {Schema,model}= require('mongoose') 

const categorySchema= new Schema ({

    name:{
        type:String,
        required:[true,'Category name is required'],
        trim:true,
        unique:true,
        minlength:[3,'Category name can be minimun 3 characters'],
       
    },

    image:{
        type:String,
        required:[true,'Product image is required'],
     },


  slug:{
        type:String,
        required:[true,'Category slug is required'],
        lowercase:true,
        unique:true,
        
       
    },


 

   

},{
    timestamps:true
})

const Category = model('Category',categorySchema)

module.exports= Category
