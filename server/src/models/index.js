const mongoose = require('mongoose')
const _ = require('lodash')
const schedule = require('node-schedule')

const Authkey = require('./authkeySchema')
const Gym = require('./gymSchema')
const Locker = require('./lockerSchema')
const Manager = require('./managerSchema')
const Member = require('./memberSchema')
const Membertype = require('./membertypeSchema')
const Option = require('./optionSchema')
const Room = require('./roomSchema')
const Schedule = require('./scheduleSchema')
const Session = require('./sessionSchema')
const Staff = require('./staffSchema')
const Teacher = require('./teacherSchema')
const Tube = require('./tubeSchema')
const User = require('./userSchema')
const WorkTime = require('./worktimeSchema')
const ReserveSchedule = require('./reserveScheduleSchema')
const Purchase = require('./purchaseSchema')
const DelayTicket = require('./delayTicketSchema')

// member
const LockerGroup = require('./member/lockerGroupSchema')

// defines
const DefineDepartment = require('./defines/departmentSchema')
const DefineInquiry = require('./defines/inquiryTypeSchema')
const DefineMarketingPath = require('./defines/marketingPathSchema')
const DefineMemberType = require('./defines/memberTypeSchema')
const DefineMemberGroup = require('./defines/memberGroupSchema')
const DefineMemberRank = require('./defines/memberRankSchema')
const DefineRegPath = require('./defines/regPathSchema')
const DefineRegType = require('./defines/regTypeSchema')
const DefinePreset = require('./defines/presetSchema')
const DefineRank = require('./defines/rankSchema')
const DefineRoom = require('./defines/roomTypeSchema')
const DefineStaff = require('./defines/staffTypeSchema')
const DefineLesson = require('./defines/lessonTypeSchema')
const DefineMembership = require('./defines/membershipSchema')
const DefineLockerGroup = require('./defines/lockerGroupSchema')

// ticket
const TicketLesson = require('./ticket/lessonSchema')
const TicketMembership = require('./ticket/membershipSchema')

// operation
const OperationNotice = require('./operation/operationNotice')

// public - ?????? ??????
const Counter = require('./public/counterSchema')

let modules = {
  Authkey,
  Gym,
  Locker,
  Manager,
  Member,
  Membertype,
  Option,
  Room,
  Schedule,
  Session,
  Staff,
  Teacher,
  Tube,
  User,
  WorkTime,
  ReserveSchedule,
  Purchase,
  DelayTicket,
  // ?????? ??????
  LockerGroup,
  // ??????
  TicketLesson,
  TicketMembership,
  // ?????? ??????
  OperationNotice,
  // ?????? ?????????
  DefineDepartment,
  DefineInquiry,
  DefineLesson,
  DefineMarketingPath,
  DefineMemberType,
  DefineMemberGroup,
  DefineMemberRank,
  DefineRegPath,
  DefineRegType,
  DefinePreset,
  DefineRank,
  DefineRoom,
  DefineStaff,
  DefineMembership,
  DefineLockerGroup,
  // ??????
  Counter
}

// ??????, ????????? memberAccess ??????
const memberAccess = require('./log/memberAccessSchema')
mongoose.connection.on('open', function (ref) {
  mongoose.connection.db.listCollections().toArray(function (err, names) {
    const time = new Date()
    const collections = _.filter(names, c => /memberaccess/.test(c.name))
    modules[`${time.getFullYear()}-memberAccess`] = memberAccess
    _.forEach(collections, c => {
      const year = c.name.split('-')[0]
      const modelName = `${year}-memberAccess`
      if (time.getFullYear() !== year) {
        modules[modelName] = memberAccess.createModel(year)
      }
    })
  })
})

// ????????? ????????? ????????? memberAccess ??????
schedule.scheduleJob('0 0 0 1 1 *', async function () {
  const time = new Date()
  const modelName = `${time.getFullYear()}-memberAccess`
  // ????????? ????????? ???????????? modeules[modelName]??? ????????????.
  modules[modelName] = memberAccess.createModel()
})

module.exports = modules
