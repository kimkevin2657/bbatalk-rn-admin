'use strict'

const SessionModel = require('../models/sessionSchema')
// const logger = require('../libs/logger')

async function findSession(query) {
  try {
    const data = await SessionModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneSession(query) {
  try {
    const data = await SessionModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addSession(data) {
  let session = new SessionModel(data)
  try {
    await session.save()
  } catch (e) {
    throw e
  }

  return session
}

async function updateSession(query, set) {
  try {
    let session = await SessionModel.findOneAndUpdate(query, set).lean()
    return session
  } catch (e) {
    throw e
  }
}

function deleteSession(query) {
  return new Promise((resolve, reject) => {
    SessionModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })

}

module.exports = {
  findSession,
  findOneSession,
  addSession,
  updateSession,
  deleteSession
}