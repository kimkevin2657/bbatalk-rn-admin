'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const memberRankSchema = new Schema({
  gymid: ObjectId, // 센터 _id
  type: {
    type: String,
    default: 'memberRank'
  },
  name: String, // 회원 등급 명
  rankPrice: Number, // 등급 설정 금액(~원 이상)
  desc: String, // 설명
  create_d: {
    type: Date,
    default: Date.now
  }
})
memberRankSchema.index({gymid:1, name:1}, { unique: true });
module.exports = mongoose.model('Define-MemberRank', memberRankSchema)