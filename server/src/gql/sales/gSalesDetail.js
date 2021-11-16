const mongoose = require('mongoose')
const _ = require('lodash')
const stats = require('../../libs/stats')

exports.typeDef = `
  extend type Query {
    "회원권 매출 DateTime"
    searchMembershipSales(gymid: String!, from: String!, to: String!): CategoryType
    "수강권 매출 DateTime"
    searchLessonSales(gymid: String!, from: String!, to: String!): CategoryType
  }
`

const ObjectId = mongoose.Types.ObjectId

exports.resolvers = {
  Query: {
    // 회원권 매출 DateTime
    async searchMembershipSales (root, { gymid, from, to }, { mongo: { TicketMembership } }) {
      const membershipSales = await TicketMembership.aggregate([
        {
          $match: {
            reg_d: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid)
          }
        },
        {
          $group: {
            _id: { gymid: '$gymid', pay_state: '$pay_state' },
            items: { $push: '$reg_d' }
          }
        }
      ])
      results = []
      const typeArr = ['미결재', '결재 완료', '양도', '환불', '양수']
      _.forEach(membershipSales, ({ _id, items }) => {
        const typeIdx = _.get(_id, ['pay_state'], -1)
        if (typeIdx === -1) return
        const times = stats.timeSplitDatas(from, to, items)
        results.push({ name: typeArr[typeIdx], data: times })
      })
      return {
        type: stats.timeSplitType(from, to),
        category: stats.timeSplitCategoryToDateTime(from, to),
        series: results
      }
    },
    // 수강권 매출 DateTime
    async searchLessonSales (root, { gymid, from, to }, { mongo: { TicketLesson } }) {
      const lessonSales = await TicketLesson.aggregate([
        {
          $match: {
            reg_d: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid)
          }
        },
        {
          $group: {
            _id: { gymid: '$gymid', pay_state: '$pay_state' },
            items: { $push: '$reg_d' }
          }
        }
      ])
      results = []
      const typeArr = ['미결재', '결재 완료', '양도', '환불', '양수']
      _.forEach(lessonSales, ({ _id, items }) => {
        const typeIdx = _.get(_id, ['pay_state'], -1)
        if (typeIdx === -1) return
        const times = stats.timeSplitDatas(from, to, items)
        results.push({ name: typeArr[typeIdx], data: times })
      })
      return {
        type: stats.timeSplitType(from, to),
        category: stats.timeSplitCategoryToDateTime(from, to),
        series: results
      }
    }
  }
}