'use strict'

const TicketModel = require('../models/ticket/lessonSchema')
// const logger = require('../libs/logger')

async function findTicket(query) {
  try {
    const data = await TicketModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneTicket(query) {
  try {
    const data = await TicketModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addTicket(data) {
  let ticket = void 0
  ticket = new TicketModel(data)
  try {
    await ticket.save()
  } catch (e) {
    throw e
  }

  return ticket
}

async function updateTicket(query, set) {
  let ticket = void 0
  try {
    ticket = await TicketModel.findOneAndUpdate(query, set).lean()
    return ticket
  } catch (e) {
    throw e
  }
}

function deleteTicket(query) {
  return new Promise((resolve, reject) => {
    TicketModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })
}

module.exports = {
  findTicket,
  findOneTicket,
  addTicket,
  updateTicket,
  deleteTicket
}