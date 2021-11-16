'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const optionSchema = new Schema({
  special_n: { // 회원 고유번호(출석체크 번호, 핸드폰뒷번호+n)
    type: String,
    unique: true
  },
  gym: { // 센터 정보
    id: ObjectId,
    name: String
  },

  name: String, // 옵션이름
  month: Number, // 개월수
  start_d: Date,
  end_d: Date,
  // regPath: String,
  
  fee: Number, // 요금
  
  create_d: { // 생성일
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Option', optionSchema);