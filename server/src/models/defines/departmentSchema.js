'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const departmentSchema = new Schema({ // 부서 구분 스키마
  gymid: ObjectId, // 센터 _id,
  type: {
    type: String,
    default: 'department'
  },
  name: String, // 부서 명
  desc: String, // 설명
  create_d: {
    type: Date,
    default: Date.now
  }
})
departmentSchema.index({gymid:1, name:1}, { unique: true });
module.exports = mongoose.model('Define-Department', departmentSchema)