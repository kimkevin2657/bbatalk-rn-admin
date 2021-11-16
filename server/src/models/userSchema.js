'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const userSchema = new Schema({
  id: { // 계정 명
    type: String,
    unique: true
  },
  hashPassword: String,
  salt: String,   // 패스워드 암호화


  special_n: {  // 회원 고유번호(출석체크 번호, 핸드폰뒷번호+n)
    type: String,
    unique: true
  },
  
  gym_a: Array,
  // // 회원명 정보
  // gym: { // 센터 정보
  //   id: ObjectId,
  //   name: String
  // },

  name: { // 회원명
    type: String
  },
  
  phone: String, // 전화번호
  gender: String, // 성별
  email: String, // 이메일
  
  create_d: { // 생성일
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);