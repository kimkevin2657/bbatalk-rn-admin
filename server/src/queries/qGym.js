'use strict'

let GymModel = require('../models/gymSchema')
// const logger = require('../libs/logger')

async function findGym(query) {
  try {
    const data = await GymModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneGym(query) {
  try {
    const data = await GymModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addGym(data) {
  return new Promise ((resolve, reject) => {
    let gym = new GymModel(data)
    gym.save()
      .then(() => {
        resolve(gym)
      })
      .catch(e => {
        reject(e)
      })
  })
  
}

async function updateGym(query, set) {
  let gym = void 0
  try {
    gym = await GymModel.findOneAndUpdate(query, set).lean()
    return gym
  } catch (e) {
    throw e
  }
}

/**
 * 센터 제거
 * @param {Object} query 
 */
function deleteGym(query) {
  return new Promise((resolve, reject) => {
    GymModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findGym,
  findOneGym,
  addGym,
  updateGym,
  deleteGym
}