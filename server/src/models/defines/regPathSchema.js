'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const regPathSchema = new Schema({
  gymid: ObjectId, // 센터 _id
  type: {
    type: String,
    default: 'regPath'
  },
  name: String, // 등록 경로 명
  desc: String, // 설명
  create_d: {
    type: Date,
    default: Date.now
  }
})
regPathSchema.index({gymid:1, name:1}, { unique: true })
module.exports = mongoose.model('Define-RegPath', regPathSchema)