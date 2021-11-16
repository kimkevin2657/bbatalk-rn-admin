'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const staffSchema = new Schema({
  /* 센터 정보 */
  gymid: ObjectId, 

  /* 기본 정보 */
  special_n: {          // 강사 고유번호(출석체크 번호, 핸드폰뒷번호+n)
    type: String,
    unique: true
  },
  name: String,         // 회원명
  engName: String,      // 영문명
  gender: String,       // 성별
  photo: String,        // 프로필 사진
  phone: String,        // 전화번호
  email: String,        // 이메일
  isLeave: Boolean,     // 퇴사 여부
  birth: String,        // 생년월일(YYYYMMDD), 뒤에 숫자로 남녀 구분
  address_f: String,    // 주소
  address_l: String,    // 상세 주소
  team: String,         // 팀(종목) PT, 필라테스..
  level: String,        // 직급(직책)

  /* 권한 */
  isOperation: Boolean, // 운영 권한 설정

  /* 선임 강사 */
  seniorid: String,
  
  /* 경력 */
  career: String, // 학력/경력 사항
  certificate: String, // 자격 사항
  
  /* SNS 정보 */
  instarid: String, // Instargram ID
  facebookid: String, // Facebook ID
  youtubeid: String, // Youtube ID
  blog: String, // blog 주소
  homepage: String, // 홈페이지 주소

  /* 급여 정보 */
  bank_n: String, // 은행명
  account_n: String, // 계좌 번호
  account_h: String, // 예금주

  /* 평가 정보 */
  score: Number, // 별 점수

  /* Etc */
  regDate: { // 등록일자
    type: Date,
    default: Date.now
  },
  memo: String,
  create_d: { // 생성일
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Staff', staffSchema);