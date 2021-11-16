'use strict'
const mongoose = require('mongoose')
// Schema
const inquiryTypeModel = require('../models/defines/inquiryTypeSchema')
const memberTypeModel = require('../models/defines/memberTypeSchema')
const lessonTypeModel = require('../models/defines/lessonTypeSchema')
const staffTypeModel = require('../models/defines/staffTypeSchema')
const roomTypeSchema = require('../models/defines/roomTypeSchema')
const presetTypeModel = require('../models/defines/presetSchema')
const departmentModel = require('../models/defines/departmentSchema')
const rankModel = require('../models/defines/rankSchema')

const ObjectId = mongoose.Types.ObjectId

const _ = require('lodash')
// const logger = require('../libs/logger')
const modelDict = {
  inquiry: inquiryTypeModel,
  member: memberTypeModel,
  lesson: lessonTypeModel,
  staff: staffTypeModel,
  room: roomTypeSchema,
  preset: presetTypeModel,
  department: departmentModel,
  rank: rankModel
}

async function findDefine(query, projection) {
  const DefineModel = modelDict[query.type]
  if (!DefineModel) throw '정의된 데이터 모델을 찾을 수 없습니다.'
  if (_.has(query, '_id')) query._id = query._id
  try {
    const data = await DefineModel.find(query, projection).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneDefine(query) {
  const DefineModel = modelDict[query.type]
  if (!DefineModel) throw '정의된 데이터 모델을 찾을 수 없습니다.'
  if (_.has(query, '_id')) query._id = query._id
  try {
    const data = await DefineModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

/**
 */
async function addDefine(data) {
  const DefineModel = modelDict[data.type]
  if (!DefineModel) throw '정의된 데이터 모델을 찾을 수 없습니다.'
  let Define = new DefineModel(data)
  try {
    await Define.save()
  } catch (e) {
    if (/E11000/.test(e.toString())) {
      throw new Error('중복되는 데이터가 존재합니다.')
    }
    throw e
  }

  return Define
}

async function updateDefine(query, update) {
  const DefineModel = modelDict[query.type]
  if (!DefineModel) throw '정의된 데이터 모델을 찾을 수 없습니다.'
  if (_.has(query, '_id')) query._id = query._id
  let Define = void 0
  try {
    if (_.has(query, ['datas._id'])) {
      query['datas._id'] = query['datas._id']
    }
    Define = await DefineModel.findOneAndUpdate(query, update, {new: true}).lean()
    return Define
  } catch (e) {
    throw e
  }
}

function deleteDefine(query) {
  const DefineModel = modelDict[query.type]
  if (!DefineModel) throw '정의된 데이터 모델을 찾을 수 없습니다.'
  if (_.has(query, '_id')) query._id = query._id
  return new Promise((resolve, reject) => {
    DefineModel.findOneAndRemove(query, (err, dom) => {
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
  findDefine,
  findOneDefine,
  addDefine,
  updateDefine,
  deleteDefine,
  bulkRemoveDefine
}