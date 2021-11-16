'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gymSchema = new Schema({
  name: String,       // 센터 명
  mid: String,        // 센터 소유자(관리자 계정 ID)
  stime: {            // 영업 시작 시간
    type: String,
    default: '06:00'
  },
  etime: {            // 영업 종료 시간
    type: String,
    default: '23:00'
  },
  desc: {             // 센터 설명
    type: String,
    default: ''
  },
  memberRank: {       // 회원 등급 누적 형식(0: 없음, 1: 올해 누적, 2: 전년 누적, 3: 전체 누적)
    type: Number,
    default: 0
  },
  transferPolicy: { // 양도 정책, 0: 양도 불가, 1: 모두에게 양도 가능, 2: 가족에게만 양도 가능
    type: Number,
    default: 1
  },
  transferPee: { // 양도 시 발생하는 기본 수수료
    type: Number,
    default: 50000
  },
  accessRange: {  // 출입 오차 범위 시간 (분)
    type: Number,
    default: 30
  },
  create_d: {         // 생성일
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gym', gymSchema);