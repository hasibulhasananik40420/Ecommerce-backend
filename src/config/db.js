const mongoose = require("mongoose");
const { mongodbUrl } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDatabase = async (options={}) => {


        try {
            await mongoose.connect(mongodbUrl,options)
            logger.log('info','connected db success')
            
            mongoose.connection.on('error', (error)=>{
                logger.log('error','db connection error:', error)
            })
        } 
        catch (error) {
            logger.log('error','could not connection db:', error.toString())
        }


};

module.exports = connectDatabase
