'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

const tubeSchema = new Schema({
  key: {
    type: String
  },  // 비디오ID
  gymid: {
    type: ObjectId
  },
  title: String,  // 비디오 제목
  description: String, // 비디오 설명
  channelTitle: String,  // 채널명
  tags: Array, // 태그
  publishedAt: Date, // 공개 일자
  create_d: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Tube', tubeSchema)
