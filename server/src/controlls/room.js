'use strict'

const qRoom = require('../queries/qRoom');
const logger = require('../libs/logger');
const _ = require('lodash')

async function getAllData(req, res) {
  try {
    const dataList = await qRoom.findRoom(req.query)
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
    const data = await qRoom.findOneRoom(req.query)
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
    const result = await qRoom.addRoom(data)
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
    const data = await qRoom.updateRoom(query, set)
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
    await qRoom.deleteRoom(req.query)
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