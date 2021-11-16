'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const lessonSchema = new Schema({
  /* 센터 정보 */
  gymid: ObjectId,          // 센터 id
  /* 회원 정보 */
  memberid: ObjectId,         // 상세 회원 정보 id
  name: String,             // 회원 명
  photo: String,            // 회원 사진
  engName: String,          // 회원 영어명
  special_n: String,        // 회원 고유번호(출석체크 번호, 핸드폰뒷번호+n)
  phone: String,            // 연락처
  gender: String,           // 성별
  memberType: String,       // 회원 구분
  /* 강사 정보 */
  staffid: ObjectId,        // 상세 강사 정보 id
  staffName: String,        // 강사 명
  staffEng: String,         // 강사 영어명
  staffTeam: String,        // 강사 팀(PX, PL, 수영...)
  staffPhoto: String,       // 강서 사진
  staffSpecial_n: String,   // 강사 고유번호
  /* 수강 티켓 정보 */
  sessionid: ObjectId,        // 세션 정보 id
  productid: String,        // 세션 상세 정보 id
  session: String,          // 세션 명
  team: String,             // 세션 팀
  month: Number,            // 개월
  sdate: Date,              // 시작일
  edate: Date,              // 종료일
  defPrice: Number,         // 기본 금액
  discount: Number,         // 할인 금액
  addDiscount: Number,      // 추가 할인 금액
  price: Number,            // 구매가
  peopleCnt: Number,        // 정원
  duration: Number,         // 회당시간, 일정 시간 부터 종료까지의 Minutes
  totCnt: Number,           // 총 횟수
  useCnt: Number,           // 사용 횟수
  chkCnt: Number,           // 출석 횟수
  nchkCnt: Number,          // 결석 횟수
  /* 결재 정보 */
  priceType: String,        // 카드, 현금, 복합
  cash: Number,             // 현금 지불 금액
  card: Number,             // 카드 지불 금액
  cardType: String,        // 카드 종류
  cash_r: String,           // 현금 영수증, 핸드폰번호/사업자번호
  vat: Number,              // 부가세
  point: Number,            // 포인트
  purchase: Number,         // 구매가
  pay_state: {              // 결재 상태, 티켓 상태, 0: 미결재, 1: 결재, 2: 양도, 3: 환불, 4: 양수
    type: Number,
    default: 0
  },
  pay_d: Date,              // 결재일
  /* 등록 정보 */
  reg_d: Date,              // 등록일
  gifts: Array,             // 사은품들 (수건 양말 등등)
  path: String,             // 등록경로 (설문, 소개 등등)

  /* 환불 정보 */
  refund_reg: Date,         // 환불 신청 일자
  refund_cause: String,     // 환불 사유
  refund_bank: String,      // 은행명
  refund_account: String,   // 계좌
  refund_name: String,      // 예금주
  refund_usePrice: Number,  // 이용 금액 (실 사용금액)
  refund_steal: Number,     // 부가 공제액 (사은품 회수액) 
  refund_penalty: Number,   // 위약금
  refund_point: Number,     // 포인트 차감
  refund_price: Number,    // 환불 금액 (환급액)

  /* 기간 변경 정보 */
  delayCnt: {               // 연장 된 횟수
    type: Number,
    default: 0
  },
  pauseCnt: {               // 일시정지 된 횟수
    type: Number,
    default: 0
  },
  /* ETC */
  input_staff: String,      // 입력 직원
  consult_staff: String,    // 상담 직원
  regPath: String,          // 등록 경로
  desc: String,             // 비고/설명
  create_d: {               // 생성일
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Ticket-Lesson', lessonSchema)
