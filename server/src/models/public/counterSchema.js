'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = mongoose.Schema.Types.ObjectId;
const counterSchema = new Schema({
  gymid: String,
  name: String, // 스키마
  cnt: { // counter
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Counter', counterSchema);