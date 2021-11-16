'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const lessonTypeSchema = new Schema({
  gymid: ObjectId, // 센터 _id
  type: {
    type: String,
    default: 'lesson'
  },
  name: String,
  peopleCnt: Number,      // 정원
  duration: Number,       // 시간(분)
  team: String,           // 부서
  defPrice: Number,       // 설정 가격(회 | 개월 당)
  // 환불 정책
  refundPrice: Number,    // 환불 기본 금액 (1일/1회 금액)
  // 기간 변경 정책
  delayCnt: Number,       // 연장 가능 횟수
  delayDay: Number,       // 연장 가능 일
  pauseCnt: Number,       // 일시정지 가능 횟수
  pauseDay: Number,        // 일시정지 가능 일

  // 상세 상품
  product: [
    {
      id: String,
      month: Number,      // 기간(개월)
      totCnt: Number,     // 횟수
      discount: Number,   // 할인 금액
      price: Number       // 가격
    }
  ]
})
lessonTypeSchema.index({gymid:1, name:1}, { unique: true });
module.exports = mongoose.model('Define-LessonType', lessonTypeSchema)