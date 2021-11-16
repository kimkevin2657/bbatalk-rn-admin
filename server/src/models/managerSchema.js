'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const managerSchema = new Schema({
  id: { // 계정명
    type: String,
    unique: true
  },
  hashPassword: String,
  salt: String,
  email: {
    type: String
  },
  phone: {
    type: String
  },
  name: String, // 관리자 이름
  gym: [
    { // 센터 정보
      id: ObjectId,
      name: String
    }
  ],
  phone: String, // 전화번호
  create_d: { // 생성일
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Manager', managerSchema);