'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const roomSchema = new Schema({
  name: String, // 룸 이름
  gym: { // 센터 정보
    id: ObjectId,
    name: String
  },
  state: Boolean, // 예약 여부
  visible: Boolean, // 노출여부
  desc: String, // 설명
  create_d: { // 생성일
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Room', roomSchema);