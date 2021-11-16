const _ = require('lodash')
const moment = require('moment')
exports.typeDef = `
  """
  강사의 업무에 대한 형식 입니다.
  """
  type WorkTime {
    _id: String
    staff: Staff
    staffid: String
    gym: Gym
    gymid: String
    type: String
    date: Date
    stime: Date
    etime: Date
  }

  input inputWorkTime {
    staffid: String!
    gymid: String!
    type: String!
    date: String!
    stime: String!
    etime: String!
  }

  extend type Query {
    allWorkTime(gymid: String!, date: Date, staffid: String, lte: String, gte: String): [WorkTime]
    findWorkTime(_id:String!): WorkTime
  }

  extend type Mutation {
    createWorkTime(input: inputWorkTime!): WorkTime
    updateWorkTime(_id: String!, input: inputWorkTime!): WorkTime
    deleteWorkTime(_id: String!): WorkTime
  }
`
exports.resolvers = {
  Query: {
    async allWorkTime (root, { gymid, staffid, date, lte, gte }, { mongo: { WorkTime } }) {
      let parmas = { gymid }
      if (staffid) parmas.staffid = staffid
      if (date) parmas.date = date
      if (lte & gte) parmas.date = { $gte: gte, $lte: lte }
      return await WorkTime.find(parmas).lean()
    },
    async findWorkTime (root, args, { mongo: { WorkTime } }) {
      return await WorkTime.findOne(args).lean()
    }
  },
  Mutation: {
    async createWorkTime (root, { input }, { mongo: { Gym, WorkTime } }) {
      // 센터 영업시간안으로 업무시간이 정해지는지 확인
      const gymData = await Gym.findOne({ _id: input.gymid })
      const gymStime = moment(gymData.stime, 'HH:mm')
      const stemp = moment(input.stime)
      const stime = moment(stemp.format('HH:mm'), 'HH:mm')
      if (stime < gymStime) throw new Error('영업시간 이전으로 설정할 수 없습니다.')
      const gymEtime = moment(gymData.etime, 'HH:mm')
      const etemp = moment(input.etime)
      const etime = moment(etemp.format('HH:mm'), 'HH:mm')
      if (etime > gymEtime) throw new Error('영업시간 이후로 설정할 수 없습니다.')
      if (stime > etime) throw new Error('시작시간이 종료시간보다 크게 설정될 수 없습니다.')

      // 업무시간 중복 확인
      let workTime = void 0
      try {
        const query = {
          $and: [
            { date: new Date(input.date) },
            { 'staffid': _.get(input, ['staffid']) },
            { gymid: input.gymid }
          ]
        }
        workTime = await WorkTime.findOne(query)
      } catch (e) {
        throw e
      }
      if (workTime) throw '이미 존재하는 업무 입니다.'
      return await WorkTime.create(input)
    },
    async updateWorkTime (root, { _id, input }, { mongo: { Gym, Schedule, WorkTime } }) {
      // 센터 영업시간안으로 업무시간이 정해지는지 확인
      const gymData = await Gym.findOne({ _id: input.gymid })
      const gymStime = moment(gymData.stime, 'HH:mm')
      const stemp = moment(input.stime)
      const stime = moment(stemp.format('HH:mm'), 'HH:mm')
      if (stime < gymStime) throw new Error('영업시간 이전으로 설정할 수 없습니다.')
      const gymEtime = moment(gymData.etime, 'HH:mm')
      const etemp = moment(input.etime)
      const etime = moment(etemp.format('HH:mm'), 'HH:mm')
      if (etime > gymEtime) throw new Error('영업시간 이후로 설정할 수 없습니다.')
      if (stime > etime) throw new Error('시작시간이 종료시간보다 크게 설정될 수 없습니다.')

      // 업무시간 중복 확인
      let workTime = void 0
      let schedules = void 0
      const $query = {
        $and: [
          { 'staffid': _.get(input, ['staffid']) },
          { gymid: input.gymid },
          { date: input.date }
        ]
      }
      try {
        let isSideSchedule = false
        schedules = await Schedule.find($query)
        if (_.isArray(schedules) && schedules.length > 0 && input.type !== 'work') {
          throw '스케줄이 포함되어 있어 업무 유형을 변경할 수 없습니다.'
        }
        // 스케줄들의 시간범위를 벗어나는지 체크
        const workStartTime = new Date(input.stime)
        const workEndTime = new Date(input.etime)
        _.forEach(schedules, (schedule) => {
          const isStart = moment(schedule.stime).isBetween(workStartTime, workEndTime, null, '[)')
          const isEnd = moment(schedule.etime).isBetween(workStartTime, workEndTime, null, '(]')
          if (!isStart || !isEnd) {
            isSideSchedule = true
          }
        })
        if (isSideSchedule) throw '변경하려는 시간 범위에 스케줄이 포함되어있습니다.'
      } catch (e) {
        throw e
      }

      try {
        workTime = await WorkTime.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
        return workTime
      } catch (e) {
        throw e
      }
    },
    async deleteWorkTime (root, { _id }, { mongo: { WorkTime, Schedule } }) {
      let workTime = void 0
      let schedule = void 0
      try {
        workTime = await WorkTime.findOne({ _id })
        schedule = await Schedule.findOne({
          staffid: workTime.staffid,
          gymid: workTime.gymid,
          date: workTime.date
        })
        if (schedule) throw '포함된 일정이 존재하여 제거 할 수 없습니다.'
        workTime.remove()
        return workTime
      } catch (e) {
        throw e
      }
    }
  },
  WorkTime: { // 센터 정보를 삽입
    async gym ({ gymid }, args, { mongo: { Gym } }) {
      const res = await Gym.findOne({ _id: gymid })
      return res
    },
    async staff ({ staffid }, args, { mongo: { Staff } }) {
      return await Staff.findOne({ _id: staffid })
    }
  }
}