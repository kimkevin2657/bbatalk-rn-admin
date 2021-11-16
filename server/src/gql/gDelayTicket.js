const _ = require('lodash')
const mongoose = require('mongoose')
// const moment = require('moment')

const ObjectId = mongoose.Types.ObjectId

// type: lesson, membership
exports.typeDef = `
  """
  회원권 또는 수강권을 기간연장이나 일시정지 시에 사용되는 정보에 대한 형식입니다.
  """
  type DelayTicket {
    _id: String!
    # 센터 정보
    gym: Gym
    gymid: String
    # 회원 정보
    memberid: String
    member: Member
    name: String
    engName: String
    special_n: String
    # 강사 정보
    staffid: String
    staff: Staff
    staffName: String
    staffEng: String
    staffSpecial_n: String
    # 티켓 정보
    ticketid: String # 티켓 정보 id
    ticketName: String
    # 연장 정보
    type: String             # 연장 유형 (delay, pause)
    d_type: String           # 기간 연장 유형 (lesson, membership)
    before_sdate: Date       # 변경 전 시작일
    before_edate: Date       # 변경 후 종료일
    pause_sdate: Date        # 정지 시작일
    pause_edate: Date        # 정지 종료일
    after_sdate: Date        # 변경 후 시작일
    after_edate: Date        # 변경 후 종료일
    cause: String            # 기간 연장 사유
    reg_d: Date              # 기간연장 신청일
    # 기타 정보
    input_staff: String
    create_d: String
  }

  input inputDelayTicket {
    _id: String
    # 센터 정보
    gymid: String
    # 회원 정보
    memberid: String
    name: String
    engName: String
    special_n: String
    # 강사 정보
    staffid: String
    staffName: String
    staffEng: String
    staffSpecial_n: String
    # 티켓 정보
    ticketid: String
    ticketName: String
    # 연장 정보
    type: String             # 연장 유형 (delay, pause)
    d_type: String           # 기간 연장 유형 (lesson, membership)
    before_sdate: Date       # 변경 전 시작일
    before_edate: Date       # 변경 후 종료일
    pause_sdate: Date        # 연장 시작일
    pause_edate: Date        # 연장 종료일
    after_sdate: Date        # 변경 후 시작일
    after_edate: Date        # 변경 후 종료일
    cause: String            # 기간 연장 사유
    reg_d: Date              # 기간연장 신청일
    # 기타 정보
    input_staff: String
  }

  extend type Query {
    allDelayTicket(gymid: String!, memberid: String, ticketid: String): [DelayTicket]
    findDelayTicket(_id: String!): DelayTicket
  }
`
exports.resolvers = {
  Query: {
    // date는 유효한 티켓 정보를 가져올 때에 사용한다.
    async allDelayTicket (root, { gymid, memberid = void 0, ticketid = void 0 }, { mongo: { DelayTicket } }) {
      let $query = { gymid }
      if (memberid) $query.memberid = memberid
      if (ticketid) $query.ticketid = ticketid
      return await DelayTicket.find($query).sort({ _id: -1 }).lean()
    },
    async findDelayTicket (root, { _id }, { mongo: { DelayTicket } }) {
      return await DelayTicket.findOne({ _id }).lean()
    }
  },
  Mutation: {
  },
  DelayTicket: {
    async gym ({ gymid }, args, { mongo: { Gym } }) { // 상세 센터 정보를 주입
      const res = await Gym.findOne({ _id: gymid })
      return res
    },
    async member ({ memberid }, args, { mongo: { Member } }) { // 상세 회원 정보를 주입
      const res = await Member.findOne({ _id: memberid })
      return res
    },
    async staff ({ staffid }, args, { mongo: { Staff } }) { // 상세 강사 정보 주입
      const res = await Staff.findOne({ _id: staffid })
      return res
    }
  }
}