'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const teacherSchema = new Schema({
  id: { // 계정명
    type: String,
    unique: true
  },
  special_n: {  // 강사 고유번호(출석체크 번호, 핸드폰뒷번호+n)
    type: String,
    unique: true
  },
  hashPassword: String,
  salt: String,
  email: {
    type: String
  },
  name: String, // 강사 이름
  gym: { // 센터 정보
    id: ObjectId,
    name: String
  },
  rank: String, // 직급
  team: String, // 팀
  career: String, // 소속
  phone: String, // 전화번호
  create_d: { // 생성일
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);