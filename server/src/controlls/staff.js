'use strict'

const qStaff = require('../queries/qStaff');
const logger = require('../libs/logger');
const _ = require('lodash')
const Symbol = 'Staff'
const util = require('../libs/utils')


async function getAllData (req, res) {
  try {
    let dataList = await qStaff.findStaff(req.query)
    res.json({
      code: 'ok',
      result: dataList
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

async function getData (req, res) {
  try {
    const data = await qStaff.findOneStaff(req.query)
    res.json({
      code: 'ok',
      result: data
    })
  } catch (e) {
    logger.error(e)
    res.status(400).send(e.toString())
  }
}

async function addData (req, res) {
  let data = req.body
  let dataUrl = data.photo
  let gymId = data.gymid
  let special_n = data.special_n

  try {
    if (/^data:./.test(dataUrl)) {
      data.photo = util.getImageFileName('staff', gymId, special_n, dataUrl)
    }
    let result = await qStaff.addStaff(data)
    if (/^data:./.test(dataUrl)) {
      await util.saveDataUrlToImage(data.photo, dataUrl)
    }

    res.json({
      code: 'ok',
      result: result
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

async function updateData (req, res) {
  const query = req.query
  const set = req.body
  let dataUrl = set.$set.photo
  let gymId = set.$set.gymid
  let special_n = set.$set.special_n

  try {
    if (/^data:./.test(dataUrl)) {
      set.$set.photo = util.getImageFileName('staff', gymId, special_n, dataUrl)
    }
    let data = await qStaff.updateStaff(query, set)
    if (/^data:./.test(dataUrl)) {
      await util.saveDataUrlToImage(data.photo, dataUrl)
    }
    res.json({
      code: 'ok',
      result: data
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

async function deleteData (req, res) {
  try {
    await qStaff.deleteStaff(req.query)
    res.json({
      code: 'ok'
    })
  } catch (e) {
    logger.error(e)
    res.status(400).send(e.toString())
  }
}

async function deleteAllData (req, res) {
  try {
    await qDefine.bulkRemoveStaff(req.query)
    res.json({
      code: 'ok'
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

async function genSecialNumber (req, res) {
  try {
    const query = req.query
    if (!_.has(query, 'phone')) {
      return res.status(400).send('핸드폰 번호 정보가 필요합니다.')
    }
    const phoneArray = query.phone.split('-')
    const lastPhone = phoneArray[phoneArray.length - 1]
    const staffs = await qStaff.findStaff({
      gymid: query.gymid,
      phone: {
        $regex: `${lastPhone}$`
      }
    })
    if (!staffs || staffs.length === 0) { // 뒷자리가 모두 일치 하지 않는다면 4자리
      return res.json({ code: 'ok', result: lastPhone })
    }
    let specialIndex = {}
    _.forEach(staffs, (o) => {
      specialIndex[o.special_n] = true
    })
    let special_n = void 0
    let i = 0
    while (_.isUndefined(special_n)) {
      const key = `${lastPhone}${i++}`
      if (!specialIndex[key]) {
        special_n = key
      }
    }
    res.json({
      code: 'ok',
      result: special_n
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

module.exports = {
  getAllData,
  getData,
  addData,
  updateData,
  deleteData,
  deleteAllData,
  genSecialNumber
}