// 제거 예정
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const staffTypeSchema = new Schema({
  gymid: { // 센터 _id
    type: ObjectId
  },
  type: {
    type: String,
    default: 'staff'
  },
  index: Number,
  departmentList: Array,    // 부서 구분
  rankList: Array,          // 직급 구분
})

module.exports = mongoose.model('Define-StaffType', staffTypeSchema); 