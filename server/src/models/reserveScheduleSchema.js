'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const reserveScheduleSchema = new Schema({
  gymid: ObjectId,        // 센터 id
  scheduleid: ObjectId,   // 스케줄 id
  ticketid: ObjectId,     // 수강권 id
  memberid: ObjectId,     // 회원 id
  staffid: ObjectId,      // 강사 id
  // 회원 정보
  mName: String,          // 회원명
  mSpecial_n: String,     // 회원 고유번호
  mPhoto: String,         // 회원 사진
  mGender: String,        // 회원 성별
  // 강사 정보
  sName: String,          // 강사명
  sSpecial_n: String,     // 강사 고유번호
  sPhoto: String,         // 강사 사진
  // 수강 정보
  tName: String,          // 수강명
  totCnt: Number,         // 총 횟수
  useCnt: Number,         // 사용 횟수
  sdate: Date,            // 유효 시작일
  edate: Date,            // 유효 종료일
  // 예약 정보
  date: Date,             // 수업일
  stime: Date,            // 수업시작시간
  etime: Date,            // 수업종료시간
  duration: Number,       // 수업시작부터 종료까지의 Minutes
  isAgree: Boolean,       // 예약 승인 상태
  state: Number,          // 출석 상태 (0: 결석, 1: 예약, 2: 출석, 3: 취소)
  register: String,       // 등록자(관리자, 강사, 회원 중)
  desc: String,           // 설명 (결석 사유)
  regDate: Date,            // 예약일시
  create_d: {             // 생성일
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ReserveSchedule', reserveScheduleSchema)
