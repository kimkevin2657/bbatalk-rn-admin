'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const purchaseSchema = new Schema({
  gymid: ObjectId,          // 센터 ID
  mid: ObjectId,            // 구매 회원 ID
  totalCnt: Number,         // 총 구매 횟수
  lessonCnt: Number,        // 수강권 구매 횟수
  membershipCnt: Number,    // 회원권 구매 횟수
  tPrice: Number,           // 총 구매금
  uPrice: Number,           // 총 미수금
  rPrice: Number,           // 총 환불금
  yPrices: Array,           // 년도별 구매금 {year, price}
  teamList: Array,          // 구매한 수강권 종목 리스트
  create_d: {               // 생성일
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);