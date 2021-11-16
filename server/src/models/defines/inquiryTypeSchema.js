'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const inquiryTypeSchema = new Schema({
  gymid: { // 센터 _id
    type: ObjectId
  },
  type: {
    type: String,
    default: 'inquiry'
  },
  name: String, // 마케팅 경로 명
  eng: String, // 영문
  desc: String,
  create_d: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Define-InquiryType', inquiryTypeSchema)