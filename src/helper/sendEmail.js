const createError = require("http-errors");
const emailWithNodemiller = require("./email");

const sendEmail = async(emailData)=>{
    try {
        await emailWithNodemiller(emailData);
      } 
      catch (emailError) {
        throw new Error(500, "Failed to send varification email");
      }
}

module.exports = sendEmail