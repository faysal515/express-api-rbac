const logger = require('@src/logger')('Mongoose')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

const db = mongoose.connection
db.on('error', () => logger.error('Cannot connect Mongodb'))
db.once('open', function() {
  logger.info('Mongodb Connected')
});
