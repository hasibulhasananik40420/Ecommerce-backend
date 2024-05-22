const User = require("../models/userModel");

const checkUserExists = async(email)=>{
     await User.exists({ email: email });
}

module.exports = checkUserExists