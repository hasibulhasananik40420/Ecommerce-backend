const jwt = require('jsonwebtoken')
const { jsonAccessKey } = require('../secret')

const isLoggedIn= async(req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken
        // console.log(accessToken)
        if(!accessToken){
            throw new Error('Access token not found. Please login')
        }

         const decoded = jwt.verify(accessToken, jsonAccessKey)
        //  console.log(decoded)
        if(!decoded){
            throw new Error('Invalid Access token. Please login')
        }

         req.user = decoded.user 
        //  console.log(req.user)
       
        next()

    } 
    catch (error) {
     next(error)
    }
}
const isLoggedOut= async(req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken
        // console.log(accessToken)
        if(accessToken){
            throw new Error('User already login')
        }

        next()

    } 
    catch (error) {
     next(error)
    }
}

//isadmin
const isAdmin= async(req,res,next)=>{
    try {
        
        // console.log('anik',req.user.isAdmin)
        if(!req.user.isAdmin){
            throw new Error("Forbidden.You must be an admin to access this resource")
        }

        next()
        

    } 
    catch (error) {
     next(error)
    }
}

module.exports = {isLoggedIn,isLoggedOut, isAdmin}



