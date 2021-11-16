'use strict'

const TeacherModel = require('../models/teacherSchema')
// const logger = require('../libs/logger')

async function findTeacher(query) {
  try {
    const data = await TeacherModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneTeacher(query) {
  try {
    const data = await TeacherModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addTeacher(data) {
  let teacher = void 0
  try {
    teacher = await TeacherModel.findOne({
      id: data.id
    })
  } catch (e) {
    throw e
  }
  if (teacher) throw new Error('이미 존재하는 강사 입니다.')
  teacher = new TeacherModel(data)
  try {
    await teacher.save()
  } catch (e) {
    throw e
  }

  return teacher
}

async function updateTeacher(query, set) {
  let teacher = void 0
  try {
    teacher = await TeacherModel.findOneAndUpdate(query, set).lean()
    return teacher
  } catch (e) {
    throw e
  }
}

function deleteTeacher(query) {
  return new Promise((resolve, reject) => {
    TeacherModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findTeacher,
  findOneTeacher,
  addTeacher,
  updateTeacher,
  deleteTeacher
}