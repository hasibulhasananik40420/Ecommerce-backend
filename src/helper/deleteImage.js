const fs = require('fs').promises


const deleteImage =async(userImagePath)=>{

  try {
   await fs.access(userImagePath) 
   await fs.unlink(userImagePath)
   console.log('User image was delete')

  } 
  catch (error) {
    console.error('user iamge does not exist')
  }
}


module.exports= {deleteImage}