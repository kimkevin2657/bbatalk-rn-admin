'use strict'

const ManagerModel = require('../models/managerSchema')
// const logger = require('../libs/logger')

async function findManager(query) {
  try {
    const data = await ManagerModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneManager(query) {
  try {
    const data = await ManagerModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addManager(data) {
  let manager = void 0
  try {
    manager = await ManagerModel.findOne({
      id: data.id
    })
  } catch (e) {
    throw e
  }
  if (manager) throw new Error('이미 존재하는 관리자 입니다.')
  manager = new ManagerModel(data)
  try {
    await manager.save()
  } catch (e) {
    throw e
  }

  return manager
}

async function updateManager(query, set) {
  let manager = void 0
  try {
    manager = await ManagerModel.findOneAndUpdate(query, set).lean()
    return manager
  } catch (e) {
    throw e
  }
}

function deleteManager(query) {
  return new Promise((resolve, reject) => {
    ManagerModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findManager,
  findOneManager,
  addManager,
  updateManager,
  deleteManager
}