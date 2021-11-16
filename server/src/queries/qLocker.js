'use strict'

const LockerModel = require('../models/lockerSchema')
// const logger = require('../libs/logger')

async function findLocker(query) {
  try {
    const data = await LockerModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneLocker(query) {
  try {
    const data = await LockerModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addLocker(data) {
  let locker = new LockerModel(data)
  try {
    await locker.save()
  } catch (e) {
    throw e
  }

  return locker
}

async function updateLocker(query, set) {
  let locker = void 0
  try {
    locker = await LockerModel.findOneAndUpdate(query, set).lean()
    return locker
  } catch (e) {
    throw e
  }
}

function deleteLocker(query) {
  return new Promise((resolve, reject) => {
    LockerModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findLocker,
  findOneLocker,
  addLocker,
  updateLocker,
  deleteLocker
}