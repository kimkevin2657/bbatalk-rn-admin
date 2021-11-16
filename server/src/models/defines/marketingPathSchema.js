'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const marketingPathSchema = new Schema({
  gymid: ObjectId, // 센터 _id
  type: {
    type: String,
    default: 'marketingPath'
  },
  name: String, // 마케팅 경로 명
  desc: String, // 설명
  create_d: {
    type: Date,
    default: Date.now
  }
})
marketingPathSchema.index({gymid:1, name:1}, { unique: true });
module.exports = mongoose.model('Define-MarketingPath', marketingPathSchema)