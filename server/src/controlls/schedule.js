'use strict'

const qSchedule = require('../queries/qSchedule');
const logger = require('../libs/logger');
const _ = require('lodash')
const Symbol = 'Schedule'

async function getAllData(req, res) {
  try {
    const dataList = await qSchedule.findSchedule(req.query)
    res.json({
      code: 'ok',
      result: dataList
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

async function getData(req, res) {
  try {
    const data = await qSchedule.findOneSchedule(req.query)
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
    const result = await qSchedule.addSchedule(data)
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
  const set = req.body
  try {
    const result = await qSchedule.updateSchedule(query, set)
    res.json({
      code: 'ok',
      result: result
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

async function deleteData(req, res) {
  try {
    await qSchedule.deleteSchedule(req.query)
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
  deleteData
}