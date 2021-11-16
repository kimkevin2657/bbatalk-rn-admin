const _ = require('lodash')
const moment = require('moment')
exports.typeDef = `
  """
  강사의 스케줄에 대한 형식입니다.
  """
  type Schedule {
    _id: String
    gym: Gym
    gymid: String
    staff: Staff
    staffid: String
    session: DefineData   # 수강권 정보
    sessionid: String # 수강권 id
    type: String
    date: Date
    time: String
    stime: Date
    etime: Date
    duration: Int
    room: DefineData
    roomid: String
    members: [ReserveSchedule]
    content: String
    create_d: Date
  }

  input inputSchedule {
    _id: String
    staffid: String!
    sessionid: String # 수강권 id
    gymid: String!
    type: String
    date: String!
    time: String!
    stime: String!
    etime: String!
    duration: Int
    roomid: String
    content: String
  }

  extend type Query {
    allSchedule(gymid: String!, date: String, staffid: String, lte: String, gte: String): [Schedule]
    findSchedule(_id:String!): Schedule
  }

  extend type Mutation {
    createSchedule(input: inputSchedule!): Schedule
    updateSchedule(_id: String!, input: inputSchedule!): Schedule
    deleteSchedule(_id: String!): Schedule
  }
`
exports.resolvers = {
  Query: {
    async allSchedule (root, { gymid, staffid, date, lte, gte }, ctx) {
      let parmas = { gymid }
      if (staffid) parmas.staffid = staffid
      if (date) parmas.date = date
      if (lte & gte) parmas.date = { $gte: gte, $lte: lte }
      return await ctx.mongo.Schedule.find(parmas).lean()
    },
    async findSchedule (root, args, ctx) {
      return await ctx.mongo.Schedule.findOne(args).lean()
    }
  },
  Mutation: {
    async createSchedule (root, { input }, ctx) {
      let schedule = void 0
      let workTime = void 0
      try {
        const query = {
          $and: [
            { 'staffid': _.get(input, ['staffid']) },
            { gymid: input.gymid },
            { date: input.date }
          ]
        }
        workTime = await ctx.mongo.WorkTime.findOne(query)
      } catch (e) {
        throw e
      }
      if (!workTime) throw new Error('업무 시간이 설정되어 있지 않습니다.')
      if (workTime.type !== 'work') throw new Error('업무 상태에서만 일정을 등록할 수 있습니다.')
      // 업무시간 범위 확인
      const isStart = moment(input.stime).isBetween(workTime.stime, workTime.etime, null, '[)')
      const isEnd = moment(input.etime).isBetween(workTime.stime, workTime.etime, null, '(]')
      if (!isStart || !isEnd) throw new Error('일정을 등록할 수 없는 시간입니다.')

      try {
        const query = {
          $and: [
            { 'staffid': _.get(input, ['staffid']) },
            { gymid: input.gymid },
            {
              $or: [
                {
                  stime: {
                    $gte: new Date(input.stime),
                    $lt: new Date(input.etime)
                  }
                },
                {
                  etime: {
                    $gt: new Date(input.stime),
                    $lt: new Date(input.etime)
                  }
                }
              ]
            }
          ]
        }
        schedule = await ctx.mongo.Schedule.findOne(query)
      } catch (e) {
        throw e
      }
      if (schedule) throw new Error('중첩되는 스케줄이 있습니다.')
      return await ctx.mongo.Schedule.create(input)
    },
    async updateSchedule (root, { _id, input }, ctx) {
      let workTime = void 0
      let schedule = void 0

      // 업무 시간 범위 체킹 로직
      try {
        const $query = {
          $and: [
            { 'staffid': _.get(input, ['staffid']) },
            { gymid: input.gymid },
            { date: input.date }
          ]
        }
        workTime = await ctx.mongo.WorkTime.findOne($query)
        if (!workTime) throw new Error('업무 시간이 설정되어 있지 않습니다.')
        if (workTime.type !== 'work') throw new Error('업무 상태에서만 일정을 등록할 수 있습니다.')
        // 업무시간 범위 확인
        const isStart = moment(input.stime).isBetween(workTime.stime, workTime.etime, null, '[)')
        const isEnd = moment(input.etime).isBetween(workTime.stime, workTime.etime, null, '(]')
        if (!isStart || !isEnd) throw '일정을 등록할 수 없는 시간입니다.'

        // 중첩 스케줄 체킹
        try {
          const $query = {
            $and: [
              { _id: { $ne: _id } },
              { staffid: input.staffid },
              { gymid: input.gymid },
              {
                $or: [
                  {
                    stime: {
                      $gte: new Date(input.stime),
                      $lt: new Date(input.etime)
                    }
                  },
                  {
                    etime: {
                      $gt: new Date(input.stime),
                      $lt: new Date(input.etime)
                    }
                  }
                ]
              }
            ]
          }
          schedule = await ctx.mongo.Schedule.findOne($query)
        } catch (e) {
          throw e
        }
        if (schedule) throw '중첩되는 스케줄이 있습니다.'
      } catch (e) {
        throw e
      }

      try {
        workTime = await ctx.mongo.Schedule.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
        return workTime
      } catch (e) {
        throw e
      }
    },
    async deleteSchedule (root, { _id }, ctx) {
      return await ctx.mongo.Schedule.findOneAndRemove({ _id })
    }
  },
  Schedule: {
    async gym ({ gymid }, args, ctx) { // 센터 정보
      const res = await ctx.mongo.Gym.findOne({ _id: gymid })
      return res
    },
    async staff ({ teacherid }, args, ctx) { // 강사 정보
      return await ctx.mongo.Staff.findOne({ _id: teacherid })
    },
    async session ({ sessionid }, args, ctx) { // 수강권 설정 정보
      return await ctx.mongo.DefineLesson.findOne({ _id: sessionid })
    },
    async room ({ roomid }, args, ctx) { // 룸 정보
      return await ctx.mongo.DefineRoom.findOne({ _id: roomid })
    },
    async members ({ _id }, args, ctx) { // 스케줄 예약
      return await ctx.mongo.ReserveSchedule.find({ scheduleid: _id })
    }
  }
}