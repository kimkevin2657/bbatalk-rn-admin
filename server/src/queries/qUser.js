'use strict'

const UserModel = require('../models/userSchema')
// const logger = require('../libs/logger')

async function findUser(query) {
  try {
    const data = await UserModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneUser(query) {
  try {
    const data = await UserModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addUser(data) {
  let user = void 0
  try {
    user = await UserModel.findOne({
      id: data.id
    })
  } catch (e) {
    throw e
  }
  if (user) throw new Error('이미 존재하는 회원 입니다.')
  user = new UserModel(data)
  try {
    await user.save()
  } catch (e) {
    throw e
  }

  return user
}

async function updateUser(query, set) {
  let user = void 0
  try {
    user = await UserModel.findOneAndUpdate(query, set).lean()
    return user
  } catch (e) {
    throw e
  }
}

function deleteUser(query) {
  return new Promise((resolve, reject) => {
    UserModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findUser,
  findOneUser,
  addUser,
  updateUser,
  deleteUser
}