'use strict'

const qManager = require('../queries/qManager');
const logger = require('../libs/logger');
const _ = require('lodash')
const Symbol = 'Manager'


async function getAllData(req, res) {
  try {
    const dataList = await qManager.findManager(req.query)
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
    const data = await qManager.findOneManager(req.query)
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
    const result = await qManager.addManager(data)
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
    const data = await qManager.updateManager(query, set)
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
    await qManager.deleteManager(req.query)
    res.json({
      code: 'ok'
    })
  } catch (e) {
    logger.error(e)
    res.status(400).send(e.toString())
  }
}



module.exports = {
  getAllData,
  getData,
  addData,
  updateData,
  deleteData
}