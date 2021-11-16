'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const memberTypeSchema = new Schema({
  gymid: ObjectId, // 센터 _id
  type: {
    type: String,
    default: 'memberType'
  },
  name: String, // 회원 구분 명
  desc: String,
  create_d: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Define-MemberType', memberTypeSchema);