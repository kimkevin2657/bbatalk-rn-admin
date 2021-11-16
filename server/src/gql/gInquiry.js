const _ = require('lodash')
const mongoose = require('mongoose')
const util = require('../libs/utils')
const logger = require('../libs/logger')

const ObjectId = mongoose.Types.ObjectId
exports.typeDef = `
  """
  회원의 설문에 대한 정보 형식입니다.
  """
  type Inquiry {
    _id: String!
    gym: Gym
    gymid: String!
    surveyDate: Date
    name: String
    gender: String
    phone: String
    membership: [String]
    lesson: [String]
    marketingPath: String
    facilityCoupon: String
    lessonCoupon: String
    couponChk: String
    visit: Date
    regChk: Date
    survey: String
  }

  input inputInquiry {
    gymid: String!
    surveyDate: Date
    name: String
    gender: String
    phone: String
    membership: [String]
    lesson: [String]
    marketingPath: String
    facilityCoupon: String
    lessonCoupon: String
    couponChk: String
    visit: Date
    regChk: Date
    survey: String
  }

  extend type Query {
    allInquiry(gymid: String!, name: String): [Inquiry]
    findInquiry(_id: String!): Inquiry
    
  }

  extend type Mutation {
    createInquiry(input: inputInquiry!): Inquiry
    updateInquiry(_id: String!, input: inputInquiry!): Inquiry
    deleteInquiry(_id: String!): Inquiry
    bulkDeleteInquiry(idList: [String]!): Boolean
  }
`
exports.resolvers = {
  Query: {
    async allInquiry (root, { gymid, name }, ctx) {
      let query = { gymid }
      if (name) {
        query.name = { $regex: name }
      }
      let dataList = await ctx.mongo.Inquiry.find(query).lean()
      return dataList
    },
    async findInquiry (root, args, ctx) {
      let data = await ctx.mongo.Inquiry.findOne(args).lean()
      return data
    }
  },
  Mutation: {
    async createInquiry (root, { input }, ctx) {
      let inquiry = void 0
      try {
        inquiry = await ctx.mongo.Inquiry.findOne({
          $and: [
            { phone: input.phone },
            { gymid: input.gymid }
          ]
        })
      } catch (e) {
        throw e
      }
      if (inquiry) throw new Error('이미 문의하신 회원의 연락처 입니다.')
      let inquiryData = await ctx.mongo.Inquiry.create(input)
      return inquiryData
    },
    async updateInquiry (root, { _id, input }, ctx) {
      // 핸드폰 번호 중복 체크
      let inquiry = void 0
      try {
        inquiry = await ctx.mongo.Inquiry.findOne({
          $and: [
            { _id: { $ne: _id } },
            { phone: input.phone },
            { gymid: input.gymid }
          ]
        })
      } catch (e) {
        throw e
      }
      if (inquiry) throw new Error('이미 문의하신 회원의 핸드폰 번호 입니다.')
      let inquiryData = await ctx.mongo.Inquiry.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
      return inquiryData
    },
    async deleteInquiry (root, { _id }, ctx) {
      return await ctx.mongo.Inquiry.findOneAndRemove({ _id })
    },
    async bulkDeleteInquiry (root, { idList }, ctx) {
      if (!_.isArray(idList) || idList.length === 0) throw new Error('제거 대상이 없습니다.')
      const removeList = _.map(idList, o => {
        return ObjectId(o)
      })
      await ctx.mongo.Inquiry.remove({ _id: { $in: removeList } })
      return true
    }
  },
  Inquiry: {
    async gym ({ gymid }, args, ctx) { // 센터 정보를 삽입
      const res = await ctx.mongo.Gym.findOne({ _id: gymid })
      return res
    },
  }
}

