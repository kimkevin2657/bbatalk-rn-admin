'use strict'

const TubeModel = require('../models/tubeSchema')
// const logger = require('../libs/logger')

async function findTube(query) {
  try {
    const data = await TubeModel.find(query)
      .sort({
        _id: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneTube(query) {
  try {
    const data = await TubeModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addTube(data) {
  let tube = void 0
  try {
    tube = await TubeModel.findOne({
      key: data.key
    })
  } catch (e) {
    throw e
  }
  if (tube) throw '이미 존재하는 동영상 입니다.'
  tube = new TubeModel(data)
  try {
    await tube.save()
  } catch (e) {
    throw e
  }

  return tube
}

async function updateTube(query, set) {
  let tube = void 0
  try {
    tube = await TubeModel.findOneAndUpdate(query, set).lean()
    return tube
  } catch (e) {
    throw e
  }
}

function deleteTube(query) {
  return new Promise((resolve, reject) => {
    TubeModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findTube,
  findOneTube,
  addTube,
  updateTube,
  deleteTube
}