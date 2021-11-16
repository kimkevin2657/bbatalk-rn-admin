'use strict'

const qDefine = require('../queries/qDefine');
const logger = require('../libs/logger');
const _ = require('lodash')


async function getAllData(req, res) {
  try {
    const dataList = await qDefine.findDefine(req.query)
    res.json({
      code: 'ok',
      result: dataList
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

// id, type 두가지 데이터가 들어올 때에 없을 경우 생성
async function getData(req, res) {
  try {
    let data = await qDefine.findOneDefine(req.query)
    res.json({
      code: 'ok',
      result: data
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

async function addData(req, res) {
  const data = req.body

  try {
    const result = await qDefine.addDefine(data)
    res.json({
      code: 'ok',
      result: result
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

async function updateData(req, res) {
  const query = req.query
  const update = req.body

  try {
    const data = await qDefine.updateDefine(query, update)
    if (!data) {
      res.status(400).send('존재하지 않는 데이터정의 입니다.')
      return
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

async function deleteData(req, res) {
  try {
    await qDefine.deleteDefine(req.query)
    res.json({
      code: 'ok'
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

async function deleteAllData(req, res) {
  try {
    await qDefine.bulkRemoveDefine(req.query)
    res.json({
      code: 'ok'
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
  deleteAllData
}