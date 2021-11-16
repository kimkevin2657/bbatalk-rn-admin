'use strict'

const qMember = require('../queries/qMember');
const logger = require('../libs/logger');
const _ = require('lodash')
const Symbol = 'Member'


async function getAllData(req, res) {
  try {
    const dataList = await qMember.findMember(req.query)
    res.json({
      code: 'ok',
      result: dataList
    })
  } catch (e) {
    logger.error(e)
    res.status(400).send(e.toString())
  }
}

async function getData(req, res) {
  try {
    const data = await qMember.findOneMember(req.query)
    res.json({
      code: 'ok',
      result: data
    })
  } catch (e) {
    logger.error(e)
    res.status(400).send(e.toString())
  }
}

async function addData(req, res) {
  const data = req.body

  try {
    const result = await qMember.addMember(data)
    res.json({
      code: 'ok',
      result: result
    })
  } catch (e) {
    logger.error(e)
    res.status(400).send(e.toString())
  }
}

async function updateData(req, res) {
  const query = req.query
  const set = req.body

  try {
    const data = await qMember.updateMember(query, set)
    res.json({
      code: 'ok',
      result: data
    })
  } catch (e) {
    logger.error(e)
    res.status(400).send(e.toString())
  }
}

async function deleteData(req, res) {
  try {
    await qMember.deleteMember(req.query)
    res.json({
      code: 'ok'
    })
  } catch (e) {
    logger.error(e)
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
    const lastPhone = phoneArray[phoneArray.length-1]
    const members = await qMember.findMember({
      gymid: query.gymid,
      phone: {
        $regex: `${lastPhone}$`
      }
    })
    if (!members || members.length === 0) { // 뒷자리가 모두 일치 하지 않는다면 4자리
      return res.json({ code: 'ok', result: lastPhone })
    }
    let specialIndex = {}
    _.forEach(members, (o) => {
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
  genSecialNumber
}