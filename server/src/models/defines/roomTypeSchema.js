'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const roomTypeSchema = new Schema({
  gymid: { // 센터 _id
    type: ObjectId
  },
  type: {
    type: String,
    default: 'room'
  },
  name: String, // 룸 명
  team: String, // 부서 구분
  desc: String, // 설명
  create_d: {
    type: Date,
    default: Date.now
  }
})
roomTypeSchema.index({gymid:1, name:1}, { unique: true });
module.exports = mongoose.model('Define-RoomType', roomTypeSchema)