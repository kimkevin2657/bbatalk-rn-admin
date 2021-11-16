'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = mongoose.Types.ObjectId

const delayTicketSchema = new Schema({
  /* 센터 정보 */
  gymid: ObjectId,    // 센터 id
  /* 회원 정보 */
  memberid: String,         // 상세 회원 정보 id
  name: String,             // 회원 명
  engName: String,          // 회원 영어명
  special_n: String,        // 회원 고유번호(출석체크 번호, 핸드폰뒷번호+n)
  /* 강사 정보 */
  staffid: String,          // 상세 강사 정보 id
  staffName: String,        // 강사 명
  staffEng: String,         // 강사 영어명
  staffSpecial_n: String,   // 강사 고유번호
  /* 티켓 정보 */
  ticketid: String,         // 티켓 정보 id
  ticketName: String,       // 티켓 명
  /* 연장 정보 */
  type: String,             // 연장 유형 (delay, pause)
  d_type: String,           // 기간 연장 유형 (lesson, membership)
  before_sdate: Date,       // 변경 전 시작일
  before_edate: Date,       // 변경 후 종료일
  pause_sdate: Date,        // 연장 시작일
  pause_edate: Date,        // 연장 종료일
  after_sdate: Date,        // 변경 후 시작일
  after_edate: Date,        // 변경 후 종료일
  cause: String,            // 기간 연장 사유
  reg_d: Date,              // 기간연장 신청일
  /* 기타 정보 */
  input_staff: String,      // 입력 직원
  create_d: {         // 생성일
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('delayTicket', delayTicketSchema);