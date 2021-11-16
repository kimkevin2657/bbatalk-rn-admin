'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const rankSchema = new Schema({ // 부서 구분 스키마
  gymid: { // 센터 _id
    type: ObjectId
  },
  type: {
    type: String,
    default: 'rank'
  },
  name: String, // 부서 명
  desc: String, // 설명
  create_d: {
    type: Date,
    default: Date.now
  }
})
rankSchema.index({gymid:1, name:1}, { unique: true });
module.exports = mongoose.model('Define-Rank', rankSchema)