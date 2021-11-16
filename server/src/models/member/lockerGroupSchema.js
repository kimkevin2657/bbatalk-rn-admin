'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
const lockerGroupSchema = new Schema({
  name: String,
  gymid: ObjectId,
  desc: String,
  create_d: { // 생성일
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LockerGroup', lockerGroupSchema);