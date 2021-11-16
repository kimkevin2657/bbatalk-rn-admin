const { GraphQLScalarType } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')
const { merge } = require('lodash')

const Gym = require('./gGym')
const Inquiry = require('./gInquiry')
const Member = require('./gMember')
const Tube = require('./gTube')
const WorkTime = require('./gWorkTime')
const Staff = require('./gStaff')
const Schedule = require('./gSchedule')
const ReserveSchedule = require('./gReserveSchedule')
const DefineData = require('./gDefineData')
const Ticket = require('./gTicket')
const Setting = require('./gSetting') // 세팅 데이터
const Purchase = require('./gPurchase')
const DelayTicket = require('./gDelayTicket')
const MemberAccess = require('./gMemberAccess') // 회원 출입 관리
const PartitionLog = require('./gPartitionLog') // 년단위 로그 관리
/* 회원 관리 */
const Locker = require('./member/gLocker')
/* 매출&지출 현황 */
const SalesState = require('./sales/gSalesState') // 매출 현황
const SalesDetail = require('./sales/gSalesDetail')
/* 운영 관리 */
const OperationNotice = require('./operation/gOperationNotice') // 운영 공지

// If you had Query fields not associated with a
// specific type you could put them here
const Query = `
  type Query {
    _empty: String
  }

  type Mutation

  scalar Date
`

// Date 타입을 추가
const DateType = new GraphQLScalarType({
  name: "Date",
  description: "Date Type",
  serialize: (value) => {
    const date = new Date(value);
    if (date.toString() === "invalid Date") { return null; }
    return date;
  }
})

const resolvers = [
  {},
  { Date: DateType },
  Gym.resolvers,
  Inquiry.resolvers,
  Member.resolvers,
  Tube.resolvers,
  Staff.resolvers,
  WorkTime.resolvers,
  Schedule.resolvers,
  ReserveSchedule.resolvers,
  DefineData.resolvers,
  Ticket.resolvers,
  Setting.resolvers,
  Purchase.resolvers,
  DelayTicket.resolvers,
  MemberAccess.resolvers,
  PartitionLog.resolvers,
  OperationNotice.resolvers,
  SalesState.resolvers,
  SalesDetail.resolvers,
  Locker.resolvers
]

const schema = makeExecutableSchema({
  typeDefs: [
    Query,
    Gym.typeDef,
    Inquiry.typeDef,
    Member.typeDef,
    Staff.typeDef,
    WorkTime.typeDef,
    Schedule.typeDef,
    ReserveSchedule.typeDef,
    Tube.typeDef,
    DefineData.typeDef,
    Ticket.typeDef,
    Setting.typeDef,
    Purchase.typeDef,
    DelayTicket.typeDef,
    MemberAccess.typeDef,
    PartitionLog.typeDef,
    OperationNotice.typeDef,
    SalesState.typeDef,
    SalesDetail.typeDef,
    Locker.typeDef
  ],
  resolvers: merge(...resolvers)
})

module.exports = schema
