'use strict'

const mongoose = require('mongoose')
const _ = require('lodash')
const logger = require('./logger')

function start () {
  const db = mongoose.connection
  db.on('error', err => {
    logger.error(`mongoose connection error: ${err}`)
  });
  db.once('open', function() {
    logger.info('mongoose connect!')
  });
  mongoose.set('useFindAndModify', false)
  if (_.get(process, ['env', 'NODE_ENV'], '') === 'production') {
    logger.info('production mongodb connect')
    mongoose.connect('mongodb://nopeople:nopeople!!@localhost/admin', { dbName: 'nopeople' })
  } else {
    logger.info('develop mongodb connect')
    mongoose.connect('mongodb://localhost/nopeople')
  }
}

exports.start = start;
