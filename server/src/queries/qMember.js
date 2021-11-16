'use strict'

const MemberModel = require('../models/memberSchema')
// const logger = require('../libs/logger')

async function findMember(query) {
  try {
    const data = await MemberModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneMember(query) {
  try {
    const data = await MemberModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addMember(data) {
  let member = void 0
  try {
    member = await MemberModel.findOne({
      $and: [
        { special_n: data.special_n },
        { gymid: data.gymid }
      ] 
    })
  } catch (e) {
    throw e
  }
  if (member) throw new Error('이미 존재하는 회원 입니다.')
  member = new MemberModel(data)
  try {
    await member.save()
  } catch (e) {
    throw e
  }

  return member
}

async function updateMember(query, set) {
  console.log('updateMember', query, set)
  let member = void 0
  try {
    member = await MemberModel.findOneAndUpdate(query, set, {new: true}).lean()
    console.log('업데이트', member)
    return member
  } catch (e) {
    throw e
  }
}

function deleteMember(query) {
  return new Promise((resolve, reject) => {
    MemberModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findMember,
  findOneMember,
  addMember,
  updateMember,
  deleteMember
}