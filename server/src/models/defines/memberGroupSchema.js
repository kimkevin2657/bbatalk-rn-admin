'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const memberGroupSchema = new Schema({
  gymid: ObjectId, // 센터 _id
  type: {
    type: String,
    default: 'memberGroup'
  },
  name: String, // 회원 분류 명
  desc: String, // 설명
  create_d: {
    type: Date,
    default: Date.now
  }
})
memberGroupSchema.index({gymid:1, name:1}, { unique: true });
module.exports = mongoose.model('Define-MemberGroup', memberGroupSchema)