const app = require('./app')
const connectDatabase = require('./config/db')
const logger = require('./controllers/loggerController')
const { port } = require('./secret')





app.listen(port, async() => {
  logger.log('info',`server are running on port ${port}`)
 await connectDatabase()
})

