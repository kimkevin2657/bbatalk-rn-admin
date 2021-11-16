'use strict'
const _ = require('lodash')
const moment = require('moment')
const ScheduleModel = require('../models/scheduleSchema')
const WorkTimeModel = require('../models/worktimeSchema')
// const logger = require('../libs/logger')

async function findSchedule(query) {
  if (_.has(query, 'date') && /^\{/.test(query.date)) {
    query.date = JSON.parse(query.date)
  }
  // if (query.stime) {
  //   query.stime = {
  //     $gte: new Date(query.stime)
  //   }
  // }
  // if (query.etime) {
  //   query.etime = {
  //     $lte: new Date(query.etime)
  //   }
  // }

  try {
    const data = await ScheduleModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneSchedule(query) {
  if (query.stime) {
    query.stime = {
      $gte: new Date(query.stime)
    }
  }
  if (query.etime) {
    query.etime = {
      $lte: new Date(query.etime)
    }
  }

  try {
    const data = await ScheduleModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addSchedule(data) {
  let schedule = void 0
  let workTime = void 0
  try {
    const query = {
      $and: [
        { 'teacher.id': _.get(data, ['teacher', 'id']) },
        { gymid: data.gymid },
        { date: data.date }
      ]
    }
    workTime = await WorkTimeModel.findOne(query)
  } catch (e) {
    throw e
  }
  if (!workTime) throw '업무 시간이 설정되어 있지 않습니다.'
  if (workTime.type !== 'work') throw '업무 상태에서만 일정을 등록할 수 있습니다.'
  // 업무시간 범위 확인
  const isStart = moment(data.stime).isBetween(workTime.stime, workTime.etime, null, '[)')
  const isEnd = moment(data.etime).isBetween(workTime.stime, workTime.etime, null, '(]')
  if (!isStart || !isEnd) throw '일정을 등록할 수 없는 시간입니다.'

  try {
    const query = {
      $and: [
        { 'teacher.id': _.get(data, ['teacher', 'id']) },
        { gymid: data.gymid },
        {
          $or: [
            {
              stime: {
                $gte: new Date(data.stime),
                $lt: new Date(data.etime)
              }
            },
            {
              etime: {
                $gt: new Date(data.stime),
                $lt: new Date(data.etime)
              }
            }
          ]
        }
      ]
    }
    schedule = await ScheduleModel.findOne(query)
  } catch (e) {
    throw e
  }
  if (schedule) throw '중첩되는 스케줄이 있습니다.'
  schedule = new ScheduleModel(data)
  try {
    await schedule.save()
  } catch (e) {
    throw e
  }

  return schedule
}

async function updateSchedule(query, set) {
  let schedule = void 0
  let workTime = void 0
  let data = set.$set
  // 업무 시간 범위 체킹 로직
  try {
    const $query = {
      $and: [
        { 'teacher.id': _.get(data, ['teacher', 'id']) },
        { gymid: data.gymid },
        { date: data.date }
      ]
    }
    workTime = await WorkTimeModel.findOne($query)
  } catch (e) {
    throw e
  }
  if (!workTime) throw '업무 시간이 설정되어 있지 않습니다.'
  if (workTime.type !== 'work') throw '업무 상태에서만 일정을 등록할 수 있습니다.'
  // 업무시간 범위 확인
  const isStart = moment(data.stime).isBetween(workTime.stime, workTime.etime, null, '[)')
  const isEnd = moment(data.etime).isBetween(workTime.stime, workTime.etime, null, '(]')
  if (!isStart || !isEnd) throw '일정을 등록할 수 없는 시간입니다.'

  // 중첩 스케줄 체킹
  try {
    const $query = {
      $and: [
        { _id: {$ne: query._id} },
        { 'teacher.id': _.get(data, ['teacher', 'id']) },
        { gymid: data.gymid },
        {
          $or: [
            {
              stime: {
                $gte: new Date(data.stime),
                $lt: new Date(data.etime)
              }
            },
            {
              etime: {
                $gt: new Date(data.stime),
                $lt: new Date(data.etime)
              }
            }
          ]
        }
      ]
    }
    schedule = await ScheduleModel.findOne($query)
  } catch (e) {
    throw e
  }
  if (schedule) throw '중첩되는 스케줄이 있습니다.'

  try {
    schedule = await ScheduleModel.findOneAndUpdate(query, set, {new: true}).lean()
    return schedule
  } catch (e) {
    throw e
  }
}

function deleteSchedule(query) {
  return new Promise((resolve, reject) => {
    if (query.stime) {
      query.stime = {
        $gte: new Date(query.stime)
      }
    }
    if (query.etime) {
      query.etime = {
        $lte: new Date(query.etime)
      }
    }
    ScheduleModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findSchedule,
  findOneSchedule,
  addSchedule,
  updateSchedule,
  deleteSchedule
}