const _ = require('lodash')
const mongoose = require('mongoose')
const logger = require('../libs/logger')
const moment = require('moment')

const ObjectId = mongoose.Types.ObjectId

exports.typeDef = `
  """
  회원이 스케줄을 예약한 현황의 형식입니다.
  """
  type ReserveSchedule {
    # 식별 정보
    _id: String!
    gymid: String
    scheduleid: String
    ticketid: String
    memberid: String
    staffid: String
    # 식별 정보를 통한 검색 정보
    gym: Gym
    schedule: Schedule
    ticket: Ticket
    member: Member
    staff: Staff
    # 회원정보
    mName: String
    mSpecial_n: String
    mPhoto: String
    mGender: String
    # 강사정보
    sName: String
    sSpecial_n: String
    sPhoto: String
    # 수강정보
    tName: String
    totCnt: Int
    useCnt: Int
    sdate: Date
    edate: Date
    # 예약정보
    date: Date
    stime: Date
    etime: Date
    duration: Int
    isAgree: Boolean
    state: Int # 0: 결석, 1: 예약, 2: 출석, 3: 취소
    register: String
    desc: String
    regDate: Date
    create_d: Date
  }

  input inputReserveSchedule {
    # 식별 정보
    _id: String
    gymid: String
    scheduleid: String
    ticketid: String
    memberid: String
    staffid: String
    # 회원정보
    mName: String
    mSpecial_n: String
    mPhoto: String
    mGender: String
    # 강사정보
    sName: String
    sSpecial_n: String
    sPhoto: String
    # 수강정보
    tName: String
    totCnt: Int
    useCnt: Int
    sdate: String
    edate: String
    # 예약정보
    date: String
    stime: String
    etime: String
    duration: Int
    isAgree: Boolean
    state: Int # 0: 결석, 1: 예약, 2: 출석, 3: 취소
    register: String
    desc: String
    regDate: String
    create_d: String
  }

  extend type Query {
    allReserveSchedule (gymid: String, scheduleid: String, memberid: String, staffid: String): [ReserveSchedule]
    findReserveSchedule(_id: String): ReserveSchedule
  }

  extend type Mutation {
    createReserveSchedule(input: inputReserveSchedule): ReserveSchedule
    updateReserveSchedule(_id: String!, input: inputReserveSchedule!): ReserveSchedule
    deleteReserveSchedule(_id: String!): ReserveSchedule
    bulkDeleteReserveSchedule(idList: [String]!): Boolean
  }
`

exports.resolvers = {
  Query: {
    async allReserveSchedule (root, args, ctx) {
      return await ctx.mongo.ReserveSchedule.find(args).lean()
    },
    async findReserveSchedule (root, args, ctx) {
      return await ctx.mongo.ReserveSchedule.findOne(args).lean()
    }
  },
  Mutation: {
    async createReserveSchedule (root, { _id, input }, ctx) {
      try {
        const ticket = await ctx.mongo.TicketLesson.findOne({ _id: input.ticketid })
        if (!ticket) throw new Error('수강권을 찾을 수가 없습니다.')
        // 예약 가능한지 확인
        const reserveMembers = await ctx.mongo.ReserveSchedule.find({ scheduleid: input.scheduleid, state: { $ne: 3 } }, { _id: 1 })
        if (reserveMembers.length >= ticket.peopleCnt) throw new Error('등록할 수 있는 회원 수가 초과되어 추가할 수 없습니다.')

        // 예약이 추가될 때에 티켓의 사용 카운트를 증가 시킨다.        
        if (ticket.totCnt <= ticket.useCnt) throw new Error('수강권을 모두 사용하였습니다.')
        ticket.useCnt++
        input.useCnt++
        ticket.save()
        return await ctx.mongo.ReserveSchedule.create(input)
      } catch (e) {
        if (/E11000/.test(e.toString())) {
          throw new Error('중복되는 데이터가 존재합니다.')
        }
        throw e
      }
    },
    async updateReserveSchedule (root, { _id, input }, ctx) {
      const ticket = await ctx.mongo.TicketLesson.findOne({ _id: input.ticketid })
      const reserveSchedule = await ctx.mongo.ReserveSchedule.findOne({ _id })

      // 예약 상태로 변경이 가능한지 확인
      if (reserveSchedule.state === 3 && input.state !== 3) {
        const reserveMembers = await ctx.mongo.ReserveSchedule.find({ scheduleid: input.scheduleid, state: { $ne: 3 } }, { _id: 1 })
        if (reserveMembers.length >= ticket.peopleCnt) throw new Error('등록할 수 있는 회원 수가 초과되어 변경할 수 없습니다.')
      }

      // 예약/출결 -> 취소
      if ([0, 1, 2].indexOf(reserveSchedule.state) >= 0 && input.state === 3) {
        ticket.useCnt--
        input.useCnt--
        ticket.save()
        // 취소 -> 예약/출결
      } else if (reserveSchedule.state === 3 && [0, 1, 2].indexOf(input.state) >= 0) {
        ticket.useCnt++
        input.useCnt++
        ticket.save()
      }
      return await ctx.mongo.ReserveSchedule.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
    },
    async deleteReserveSchedule (root, { _id }, ctx) {
      return await ctx.mongo.ReserveSchedule.fineOneAndRemove({ _id })
    },
    async bulkDeleteReserveSchedule (root, { type, idList }, ctx) {
      if (!_.isArray(idList) || idList.length === 0) throw new Error('제거 대상이 없습니다.')
      const removeList = _.map(idList, o => {
        return ObjectId(o)
      })
      const result = await ctx.mongo.ReserveSchedule.remove({ _id: { $in: removeList } })
      return true
    }
  },
  ReserveSchedule: {
    async gym ({ gymid }, args, ctx) { // 상세 센터 정보를 주입
      return await ctx.mongo.Gym.findOne({ _id: gymid })
    },
    async member ({ memberid }, args, ctx) { // 상세 회원 정보를 주입
      return await ctx.mongo.Member.findOne({ _id: memberid })
    },
    async staff ({ staffid }, args, ctx) { // 상세 강사 정보 주입
      return await ctx.mongo.Staff.findOne({ _id: staffid })
    },
    async ticket ({ ticketid }, args, ctx) { // 상세 수강 정보 주입
      return await ctx.mongo.TicketLesson.findOne({ _id: ticketid })
    }
  }
}
