'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const lockerSchema = new Schema({
  name: String,
  gym: { // 락커 정보
    id: ObjectId,
    name: String
  },
  user: { // 대여자
    id: ObjectId,
    name: String
  },
  stime: Date, // 대여 시작 일자
  etime: Date, // 대여 종료 일자
  state: Boolean, // 대여: true, 비대여: false
  create_d: { // 생성일
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Locker', lockerSchema);