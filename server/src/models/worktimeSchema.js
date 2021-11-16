'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const workTimeSchema = new Schema({
  staffid: ObjectId,
  gymid: { // 센터 _id
    type: ObjectId
  },
  type: String, // 업무 상태, none, work, vacation
  date: { // 업무 일자
    type: Date,
    index: true
  },
  stime: Date, // 업무 시작
  etime: Date // 업무 종료
});

module.exports = mongoose.model('Worktime', workTimeSchema);
