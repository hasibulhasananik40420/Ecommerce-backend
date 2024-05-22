const jwt = require('jsonwebtoken');

const createJSONWebToken=(payload, sceretKey, expiresIn)=>{

     if(typeof payload !== 'object' || !payload ){
        throw new Error('payload must be non empty object')
     }

     if(typeof sceretKey!== 'string' || sceretKey === ''){
        throw new Error (' sceretKey must be non empty object')
     }
   

     try {
        const token = jwt.sign(payload , sceretKey, {expiresIn});
        return token
     } 
     catch (error) {
         console.error('Failed to sing in jwt:' ,error)
         throw error
     }

}

module.exports ={createJSONWebToken}


