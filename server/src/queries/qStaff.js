'use strict'

const StaffModel = require('../models/staffSchema')
// const logger = require('../libs/logger')

async function findStaff(query) {
  try {
    const data = await StaffModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneStaff(query) {
  try {
    const data = await StaffModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addStaff(data) {
  let staff = void 0
  try {
    staff = await StaffModel.findOne({
      $and: [
        { special_n: data.special_n },
        { gymid: data.gymid }
      ] 
    })
  } catch (e) {
    throw e
  }
  if (staff) throw new Error('이미 존재하는 강사 입니다.')
  staff = new StaffModel(data)
  try {
    await staff.save()
  } catch (e) {
    throw e
  }

  return staff
}

async function updateStaff(query, set) {
  let staff = void 0
  try {
    staff = await StaffModel.findOneAndUpdate(query, set, {new: true}).lean()
    return staff
  } catch (e) {
    throw e
  }
}

function deleteStaff(query) {
  return new Promise((resolve, reject) => {
    StaffModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

async function bulkRemoveDefine(query) {
  const DefineModel = modelDict[query.type]
  if (!DefineModel) throw '정의된 데이터 모델을 찾을 수 없습니다.'
  if (!_.has(query, 'ids') || !_.isArray(query.ids) || query.ids.length === 0) throw '제거 대상이 없습니다.'

  try {
    const idsList = _.map(query.ids, o => {
      return ObjectId(o)
    })
    const result = await DefineModel.remove({_id: {$in: idsList}})
    return result
  } catch (e) {
    throw e
  }
}

module.exports = {
  findStaff,
  findOneStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  bulkRemoveDefine
}