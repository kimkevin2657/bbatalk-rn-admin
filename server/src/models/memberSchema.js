'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const memberSchema = new Schema({
  special_n: { // 회원 고유번호(출석체크 번호, 핸드폰뒷번호+n)
    type: String,
    unique: true
  },
  gymid: {
    type: ObjectId
  },
  
  photo: String, // 사진
  name: { // 회원명
    type: String
  },
  engName: { // 영문명
    type: String
  },
  gender: String, // 성별
  ranking: Number,  // 랭킹
  phone: String, // 전화번호
  email: String,  // 이메일

  // 등록일자
  regDate: { // 등록일자
    type: Date,
    default: Date.now
  },
  regType: String, // 등록 구분 (신규, 재등록(2회), 양도, 환불, 만기)
  regPath: String, // 등록 경로 (검색, 블로그, 추천 등등)
  // 생년월일
  birth: String, // 생년월일(YYYYMMDD)  // 뒤에 숫자로 남녀 구분

  // 주소
  address_f: String, // 주소
  address_l: String, // 주소

  // 회원 구분
  memberType: String, // 회원 구분
  memberGroup: Array, // 회원 분류(일반, 보증금, 입주민, 법인, 단체, 가족, 지원) 복수로 들어감
  
  // 회원권 
  membership: Array, // 회원권  {name, month, sdate, edate, price, staff} // 회원권 개월 // 회원권 기간 // 회원 등록 경로 }

  // 강습 권
  lesson: Array,  // 강습명 {name, peopleCnt, number, month, teacher, sdate, edate, price, staff}

  // 유소년 강습
  youth: Array,  // 강습명 {name, peopleCnt, number, month, teacher, sdate, edate, price, staff}

  // 옵션
  option: Array,    // { optionName: optionMonth: String, // 유효 개월   optionDate: String, // 강습 기간 }
  
  // 포인트
  point: Number,

  // 소속(가족)
  familyids: [], // memberId

  // 단체 소속
  organization: String,

  // 추천자
  recommenderid: String,

  // 회원 차량 번호
  carNumber_f: String,
  carNumber_l: String,

  // 등록 메모
  regMemo: String,

  

  // 아래 나중에 작업할것들 미리 데이터만 잡아둠
  consult_c: { // 상담 횟수
    type: Number,
    default: 0
  },
  visit_c: { // 방문 횟수
    type: Number,
    default: 0
  },
  count_arr: Array, // 카운트 정보 배열, {tc: 0, c: 0}}
  create_d: { // 생성일
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Member', memberSchema);
