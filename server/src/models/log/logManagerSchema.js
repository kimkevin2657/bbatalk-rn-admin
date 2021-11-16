'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const ObjectId = mongoose.Types.ObjectId

const logManagerSchema = new Schema({
  name: String, // Collection Name
  year: Number, // Collection Year
});

module.exports = mongoose.model('logManager', logManagerSchema);