'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const operationNoticeSchema = new Schema({
  num: Number, // 게시글 번호
  name: String, // 작성자
  title: String, // 게시글 제목
  content: String, // 게시글 내용
  hashPassword: String, // 게시글 비번 정보1
  salt: String, // 게시글 비번 정보2
  comments: [
    {
      name: String, // 댓글 작성자
      hashPassword: String, // 댓글 비번 정보1
      salt: String, // 댓글 비번 정보2
      comment: String // 댓글 정보
    }
  ],
  gymid: ObjectId, // 센터 _id
  see: {
    type: Number,
    default: 0
  },
  create_d: { // 생성일
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('OperationNotice', operationNoticeSchema);