'use strict'

const RoomModel = require('../models/roomSchema')
// const logger = require('../libs/logger')

async function findRoom(query) {
  try {
    const data = await RoomModel.find(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneRoom(query) {
  try {
    const data = await RoomModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addRoom(data) {
  let room = new RoomModel(data)
  try {
    await room.save()
  } catch (e) {
    throw e
  }

  return room
}

async function updateRoom(query, set) {
  try {
    let room = await RoomModel.findOneAndUpdate(query, set)
      .sort({
        create_t: -1
      }).lean()
    return room
  } catch (e) {
    throw e
  }
}

function deleteRoom(query) {
  return new Promise((resolve, reject) => {
    RoomModel.findOneAndDelete(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findRoom,
  findOneRoom,
  addRoom,
  updateRoom,
  deleteRoom
}