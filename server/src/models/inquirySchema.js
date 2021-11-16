'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const inquirySchema = new Schema({

  gymid: {
    type: ObjectId
  },
  surveyDate: Date,
  name: { // 문의 회원명
    type: String
  },
  gender: String, // 성별
  phone: String, // 전화번호

  membership: Array, // 회원권 종류
  lesson: Array,  // 강습권 종류
  marketingPath: String, // 마케팅 경로
  introducer: String, // 소개자
  facilityCoupon: String, // 시설 쿠폰
  lessonCoupon: String, // 강습 쿠폰
  couponChk: String, // 쿠폰 사용 여부
  visit: Date, // 방문 정보
  regChk: Date, // 등록 여부(등록했으면 등록날짜, 미등록 시 미기재)
  sruvey: String // 설문지 정보
});

module.exports = mongoose.model('Inquiry', InquirySchema);
