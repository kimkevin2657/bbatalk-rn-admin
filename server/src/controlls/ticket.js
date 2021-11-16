'use strict'

const qTicket = require('../queries/qTicket');
const qMember = require('../queries/qMember');

const logger = require('../libs/logger');
const _ = require('lodash')
const Symbol = 'Ticket'


async function getAllData(req, res) {
  try {
    const dataList = await qTicket.findTicket(req.query)
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
    const data = await qTicket.findOneTicket(req.query)
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
  var code = 'err'
  try {
    const result = await qTicket.addTicket(data)
    code = 'ok'
  } catch (e) {
    logger.error(e)
    res.status(400).send(e.toString())
    return
  }

  if(code === 'ok')
  {
    // 회원 찾아서 해당 회원 DB에 티켓 정보 갱신해주자
    const member = await qMember.findOneMember({gymid: data.gymid, special_n: data.special_n})
    try {
      const result = await qMember.updateMember({gymid: data.gymid, special_n: data.special_n}, {membershipData: data.membershipData })
      res.json({
        code: 'ok',
        result: result
      })
    } catch (e) {
      logger.error(e)
      res.status(400).send(e.toString())
    }
  }

}

async function updateData(req, res) {
  const query = req.query
  const set = req.body

  try {
    const data = await qTicket.updateTicket(query, set)
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
    await qTicket.deleteTicket(req.query)
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