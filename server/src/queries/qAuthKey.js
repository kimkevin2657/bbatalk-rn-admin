'use strict'

const AuthkeyModel = require('../models/authkeySchema')
// const logger = require('../libs/logger')

async function findOneAuthKey(query) {
  try {
    const data = await AuthkeyModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addAuthKey(data) {
  let authKey = void 0
  try {
    authKey = await AuthkeyModel.findOne({
      email: data.email
    })
  } catch (e) {
    throw e
  }
  if (authKey) throw new Error('이미 존재하는 인증번호 입니다.')
  data.expire = new Date()
  authKey = new AuthkeyModel(data)
  try {
    await authKey.save()
  } catch (e) {
    throw e
  }

  return authKey
}

function deleteAuthKey(query) {
  return new Promise((resolve, reject) => {
    AuthkeyModel.findOneAndRemove(query, (err, authkey) => {
      if (err) return reject(err)
      resolve(authkey)
    })
  })
}

module.exports = {
  findOneAuthKey,
  addAuthKey,
  deleteAuthKey
}