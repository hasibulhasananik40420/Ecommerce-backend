const User = require("../models/userModel")
const data = require('../data')
const Product = require("../models/productModel")



const seedUser = async(req,res,next)=>{
    try {
        //delete all user
        await User.deleteMany({})

        //insert user
        const users = await User.insertMany(data.users)

        return res.status(201).json(users)
    } 
    catch (error) {
       next(error) 
    }
}



const seedProducts = async(req,res,next)=>{
    try {
        //delete all user
        await Product.deleteMany({})

        //insert user
        const products = await Product.insertMany(data.products) 
        // console.log(products)

        return res.status(201).json(products)
    } 
    catch (error) {
       next(error) 
    }
}




   
module.exports = {seedUser,seedProducts}


