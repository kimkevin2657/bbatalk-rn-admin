'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const scheduleSchema = new Schema({
  staffid: ObjectId,    // 강사 정보
  gymid: ObjectId,      // 센터 _id
  type: String,         // 스케줄 유형, lesson, normal
  date: Date,           // 일정 일
  time: String,         // 시간 (HH:mm)
  stime: Date,          // 일정 시작
  etime: Date,          // 일정 종료
  duration: Number,     // 일정 시간 부터 종료까지의 Minutes
  sessionid: ObjectId,  // 세션 정보
  roomid: ObjectId,     // 룸 정보
  members: [{           // 예약된 회원 정보
    _id: ObjectId,
    name: String,       // 회원 명
    special_n: String,
    state: {            // 0: 결석, 1: 예약, 2: 출석, 3: 취소
      type: Number,
      default: 1
    },
    tc: {               // 수강권 총 횟수
      type: Number,
      default: 0
    },
    c: {                // 수강권 사용 횟수
      type: Number,
      default: 0
    }
  }],
  content: String,      // 일정 정보
  create_d: {           // 생성일
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Schedule', scheduleSchema);