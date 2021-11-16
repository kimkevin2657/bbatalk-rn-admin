const moment = require('moment')
const mongoose = require('mongoose')
const _ = require('lodash')
const stats = require('../../libs/stats')

exports.typeDef = `
  "매출 통계"
  type SalesStats {
    membership: SalesStatsDetail
    lesson: SalesStatsDetail
    option: SalesStatsDetail
    total: SalesStatsDetail
  }
  "매출 통계 상세"
  type SalesStatsDetail {
    sales: Float
    cnt: Int
    refund: Float
    rcnt: Int
  }

  "CategoryType 차트 유형 포맷"
  type CategoryType {
    type: String
    category: [String]
    series: [CategoryDetail]
  }

  "CategoryDetail 위젯 포맷"
  type CategoryDetail {
    name: String
    data: [Int]
  }

  "매출 상위 고객 Top10 포맷"
  type MemberTopTen {
    _id: ID
    name: String
    special_n: String
    engName: String
    photo: String
    gender: String
    price: Int
  }
  "실적 상위 강사 Top10 포맷"
  type StaffTopTen {
    _id: ID
    name: String
    team: String
    special_n: String
    engName: String
    photo: String
    price: Int
  }

  extend type Query {
    "매출 통계 쿼리"
    searchSalesStats(gymid: String!, from: String!, to: String!): SalesStats
    "회원유형 건수"
    searchMembershipType(gymid: String!, from: String!, to: String!): CategoryType
    "회원권 건수"
    searchMembershipTicket(gymid: String!, from: String!, to: String!): CategoryType
    "수강팀 계약 건수"
    searchLessonTeam(gymid: String!, from: String!, to: String!): CategoryType
    "수강권 계약 건수"
    searchLessonTicket(gymid: String!, from: String!, to: String!): CategoryType
    "매출 상위 고객 Top10"
    searchMemberTopTen(gymid: String!, from: String!, to: String!): [MemberTopTen]
    "실적 상위 강사 Top10"
    searchStaffTopTen(gymid: String!, from: String!, to: String!): [StaffTopTen]
  }
`
const ObjectId = mongoose.Types.ObjectId

exports.resolvers = {
  Query: {
    // 매출 통계
    async searchSalesStats (root, { gymid, from, to }, { mongo: { TicketMembership, TicketLesson } }) {
      const membership = { sales: 0, cnt: 0, refund: 0, rcnt: 0 }
      const lesson = { sales: 0, cnt: 0, refund: 0, rcnt: 0 }
      const option = { sales: 0, cnt: 0, refund: 0, rcnt: 0 }
      const total = { sales: 0, cnt: 0, refund: 0, rcnt: 0 }
      // 회원권 통계 쿼리
      const membershipSales = await TicketMembership.aggregate([
        {
          $match: {
            reg_d: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid),
            $or: [{ pay_state: 1 }, { pay_state: 2 }, { pay_state: 4 }]
          }
        },
        { $group: { _id: '$gymid', sales: { $sum: '$purchase' }, cnt: { $sum: 1 } } }
      ])
      const membershipRefund = await TicketMembership.aggregate([
        {
          $match: {
            refund_reg: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid),
            pay_state: 3
          }
        },
        { $group: { _id: '$gymid', refund: { $sum: '$refund_price' }, rcnt: { $sum: 1 } } }
      ])
      // 수강권 통계 쿼리
      const lessonSales = await TicketLesson.aggregate([
        {
          $match: {
            reg_d: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid),
            $or: [{ pay_state: 1 }, { pay_state: 2 }, { pay_state: 4 }]
          }
        },
        { $group: { _id: '$gymid', sales: { $sum: '$purchase' }, cnt: { $sum: 1 } } }
      ])
      const lessonRefund = await TicketLesson.aggregate([
        {
          $match: {
            refund_reg: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid),
            pay_state: 3
          }
        },
        { $group: { _id: '$gymid', refund: { $sum: '$refund_price' }, rcnt: { $sum: 1 } } }
      ])
      membership.sales = _.get(membershipSales, [0, 'sales'], 0)
      membership.cnt = _.get(membershipSales, [0, 'cnt'], 0)
      membership.refund = _.get(membershipRefund, [0, 'refund'], 0)
      membership.rcnt = _.get(membershipRefund, [0, 'rcnt'], 0)
      lesson.sales = _.get(lessonSales, [0, 'sales'], 0)
      lesson.cnt = _.get(lessonSales, [0, 'cnt'], 0)
      lesson.refund = _.get(lessonRefund, [0, 'refund'], 0)
      lesson.rcnt = _.get(lessonRefund, [0, 'rcnt'], 0)
      total.sales = membership.sales + lesson.sales + option.sales
      total.cnt = membership.cnt + lesson.cnt + option.cnt
      total.refund = membership.refund + lesson.refund + option.refund
      total.rcnt = membership.rcnt + lesson.rcnt + option.rcnt

      return {
        from, to,
        membership, lesson, option, total
      }
    },
    // 회원유형 건수(memberType)
    async searchMembershipType (root, { gymid, from, to }, { mongo: { TicketMembership } }) {
      // 회원권 통계 쿼리
      const membershipTypes = await TicketMembership.aggregate([
        {
          $match: {
            reg_d: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid),
            $or: [{ pay_state: 1 }, { pay_state: 2 }, { pay_state: 4 }]
          }
        },
        { $group: { _id: '$memberType', items: { $push: '$reg_d' } } }
      ])
      const results = []
      _.forEach(membershipTypes, ({ _id, items }) => {
        const times = stats.timeSplitDatas(from, to, items)
        results.push({ name: _id, data: times })
      })
      return {
        type: stats.timeSplitType(from, to),
        category: stats.timeSplitCategory(from, to),
        series: results
      }
    },
    // 회원권 건수(session)
    async searchMembershipTicket (root, { gymid, from, to }, { mongo: { TicketMembership } }) {
      // 회원권 통계 쿼리
      const membershipTypes = await TicketMembership.aggregate([
        {
          $match: {
            reg_d: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid),
            $or: [{ pay_state: 1 }, { pay_state: 2 }, { pay_state: 4 }]
          }
        },
        { $group: { _id: '$session', items: { $push: '$reg_d' } } }
      ])
      const results = []
      _.forEach(membershipTypes, ({ _id, items }) => {
        const times = stats.timeSplitDatas(from, to, items)
        results.push({ name: _id, data: times })
      })
      return {
        type: stats.timeSplitType(from, to),
        category: stats.timeSplitCategory(from, to),
        series: results
      }
    },
    // 수강팀 계약 건수(team)
    async searchLessonTeam (root, { gymid, from, to }, { mongo: { TicketLesson } }) {
      // 수강권 통계 쿼리
      const lessonTeams = await TicketLesson.aggregate([
        {
          $match: {
            reg_d: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid),
            $or: [{ pay_state: 1 }, { pay_state: 2 }, { pay_state: 4 }]
          }
        },
        { $group: { _id: '$team', items: { $push: '$reg_d' } } }
      ])
      const results = []
      _.forEach(lessonTeams, ({ _id, items }) => {
        const times = stats.timeSplitDatas(from, to, items)
        results.push({ name: _id, data: times })
      })
      return {
        type: stats.timeSplitType(from, to),
        category: stats.timeSplitCategory(from, to),
        series: results
      }
    },
    // 수강권 계약 건수(session)
    async searchLessonTicket (root, { gymid, from, to }, { mongo: { TicketLesson } }) {
      // 수강권 통계 쿼리
      const lessonTeams = await TicketLesson.aggregate([
        {
          $match: {
            reg_d: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid),
            $or: [{ pay_state: 1 }, { pay_state: 2 }, { pay_state: 4 }]
          }
        },
        { $group: { _id: '$session', items: { $push: '$reg_d' } } }
      ])
      const results = []
      _.forEach(lessonTeams, ({ _id, items }) => {
        const times = stats.timeSplitDatas(from, to, items)
        results.push({ name: _id, data: times })
      })
      return {
        type: stats.timeSplitType(from, to),
        category: stats.timeSplitCategory(from, to),
        series: results
      }
    },
    // 매출 상위 고객 Top10
    async searchMemberTopTen (root, { gymid, from, to }, { mongo: { Gym } }) {
      const match = {
        $match: {
          reg_d: {
            $gte: new Date(from),
            $lte: new Date(to)
          },
          gymid: ObjectId(gymid),
          $or: [{ pay_state: 1 }, { pay_state: 2 }, { pay_state: 4 }]
        }
      }
      const proejction = {
        $project: { _id: 1, memberid: 1, name: 1, special_n: 1, engName: 1, photo: 1, purchase: 1, gender: 1 }
      }

      // 1. 하나 이상의 문서가 포함 된 컬렉션을 사용
      const members = await Gym.aggregate([
        // 2. 컬렉션 문서를 하나만 보관
        { $limit: 1 },
        // 3. 문서에서 모든 것을 제거
        { $project: { _id: '$$REMOVE' } },
        // 4. 통합 할 컬렉션을 조회
        { $lookup: { from: 'ticket-memberships', pipeline: [match, proejction], as: 'memberships' } },
        { $lookup: { from: 'ticket-lessons', pipeline: [match, proejction], as: 'lessons' } },
        // 5. 프로젝션으로 컬렉션을 결합
        { $project: { union: { $concatArrays: ["$memberships", "$lessons"] } } },
        // 6. union을 루트로 풀어준다
        { $unwind: '$union' },
        { $replaceRoot: { newRoot: '$union' } },
        {
          $group: {
            _id: '$memberid',
            name: { $first: '$name' },
            photo: { $first: '$photo' },
            special_n: { $first: '$special_n' },
            gender: { $first: '$gender' },
            price: { $sum: '$purchase' }
          }
        },
        { $sort: { price: -1 } },
        { $limit: 10 }
      ])
      return members
    },
    // 실적 상위 고객 Top10
    async searchStaffTopTen (root, { gymid, from, to }, { mongo: { TicketLesson } }) {
      const staffs = await TicketLesson.aggregate([
        {
          $match: {
            reg_d: {
              $gte: new Date(from),
              $lte: new Date(to)
            },
            gymid: ObjectId(gymid),
            $or: [{ pay_state: 1 }, { pay_state: 2 }, { pay_state: 4 }]
          }
        },
        {
          $group: {
            _id: '$staffid',
            name: { $first: '$staffName' },
            team: { $first: '$staffTeam' },
            photo: { $first: '$staffPhoto' },
            special_n: { $first: '$staffSpecial_n' },
            price: { $sum: '$purchase' }
          }
        },
        { $sort: { price: -1 } },
        { $limit: 10 }
      ])
      return staffs
    }
  }
}