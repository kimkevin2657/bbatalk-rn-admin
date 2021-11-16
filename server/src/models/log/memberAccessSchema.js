'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = mongoose.Types.ObjectId

const memberAccessSchema = new Schema({
  /* 센터 정보 */
  gymid: ObjectId,    // 센터 id
  /* 회원 정보 */
  memberid: String,         // 상세 회원 정보 id
  name: String,             // 회원 명
  engName: String,          // 회원 영어명
  special_n: String,        // 회원 고유번호(출석체크 번호, 핸드폰뒷번호+n)
  /* 티켓 정보 */
  ticketid: String,         // 티켓 정보 id
  ticketName: String,       // 티켓 이름
  /* 입장 정보 */
  type: String,             // 입장 유형, (membership, lesson)
  /* 기타 정보 */
  create_d: {               // 생성일
    type: Date,
    default: Date.now
  }
});
const time = new Date()
const modelName = `${time.getFullYear()}-memberAccess`
let model = mongoose.model(modelName, memberAccessSchema)
// 새로운 모델 생성
model.createModel = function (year = void 0) {
  let mName = void 0
  if (year) {
    mName = `${year}-memberAccess`
  } else {
    const t = new Date()
    mName = `${t.getFullYear()}-memberAccess`
  }
  return mongoose.model(mName, memberAccessSchema)
}
module.exports = model
