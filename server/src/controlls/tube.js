'use strict'

const qTube = require('../queries/qTube')
const logger = require('../libs/logger')
const youtube = require('../libs/youtube')
const _ = require('lodash')


async function getAllData(req, res) {
  try {
    const dataList = await qTube.findTube(req.query)
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
    const data = await qTube.findOneTube(req.query)
    res.json({
      code: 'ok',
      result: data
    })
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

/**
 * youtube API를 이용하여 정보를 가져오고 디비에 삽입 후 결과 반환
 */
async function addData(req, res) {
  const data = req.body
  if (!_.has(data, 'key')) return res.status(400).send('동영상 키가 없습니다.')
  // TODO: request 모듈을 이용해서 비디오 키로 RestAPI 요청하고 DB추가 및 반환 하기

  let vedioInfo = void 0
  try {
    vedioInfo = await youtube.vedioInfo(data.key)
    if (!vedioInfo) return res.status(400).send('동영상을 찾을 수 없습니다.')
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
    return
  }
  vedioInfo.key = data.key
  vedioInfo.gymid = data.gymid
  try {
    await qTube.addTube(vedioInfo)
    res.json({
      code: 'ok',
      result: vedioInfo
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
    const data = await qTube.updateTube(query, set)
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
    await qTube.deleteTube(req.query)
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