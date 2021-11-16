'use strict'

const _ = require('lodash')
const moment = require('moment')
const WorkTimeModel = require('../models/worktimeSchema')
const ScheduleModel = require('../models/scheduleSchema')
// const logger = require('../libs/logger')

async function findWorkTime(query) {
  if (_.has(query, 'date') && /^\{/.test(query.date)) {
    query.date = JSON.parse(query.date)
  }
  try {
    const data = await WorkTimeModel.find(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneWorkTime(query) {
  try {
    const data = await WorkTimeModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addWorkTime(data) {
  let workTime = void 0
  try {
    const query = {
      $and: [
        { date: new Date(data.date) },
        { 'teacher.id': _.get(data, ['teacher', 'id'])},
        { gymid: data.gymid}
      ] 
    }
    workTime = await WorkTimeModel.findOne(query)
  } catch (e) {
    throw e
  }
  if (workTime) throw '이미 존재하는 업무 입니다.'
  workTime = new WorkTimeModel(data)
  try {
    await workTime.save()
  } catch (e) {
    throw e
  }

  return workTime
}

async function updateWorkTime(query, update) {
  let workTime = void 0
  let schedules = void 0
  let data = update.$set
  const $query = {
    $and: [
      { 'teacher.id': _.get(data, ['teacher', 'id']) },
      { gymid: data.gymid },
      { date: data.date }
    ]
  }
  try {
    let isSideSchedule = false
    schedules = await ScheduleModel.find($query)
    if (_.isArray(schedules) && schedules.length > 0 && data.type !== 'work') {
      throw '스케줄이 포함되어 있어 업무 유형을 변경할 수 없습니다.'
    }
    // 스케줄들의 시간범위를 벗어나는지 체크
    const workStartTime = new Date(data.stime)
    const workEndTime = new Date(data.etime)
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
    workTime = await WorkTimeModel.findOneAndUpdate(query, update, {new: true}).lean()
    return workTime
  } catch (e) {
    throw e
  }
}

async function deleteWorkTime(query) {
  let workTime = void 0
  let schedule = void 0
  try {
    workTime = await WorkTimeModel.findOne(query)
    schedule = await ScheduleModel.findOne({
      'teacher.id': workTime.teacher.id,
      gymid: workTime.gymid,
      date: workTime.date
    })
    if (schedule) throw '포함된 일정이 존재하여 제거 할 수 없습니다.'
    workTime.remove()
    // const dom = await WorkTimeModel.findOneAndRemove(query)
    return workTime
  } catch (e) {
    throw e
  }

}

module.exports = {
  findWorkTime,
  findOneWorkTime,
  addWorkTime,
  updateWorkTime,
  deleteWorkTime
}
