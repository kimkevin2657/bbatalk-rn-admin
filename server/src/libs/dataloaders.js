const DataLoader = require('dataloader')
const moment = require('moment')
const _ = require('lodash')

async function batchGyms (Gym, keys) {
  return await Gym.find({_id: {$in: keys}})
}

async function batchMember (Member, keys) {
  return await Member.find({_id: {$in: keys}})
}

async function batchPurchase (Purchase, keys) {
  const results = await Purchase.find({mid: {$in: keys}})
  let index = {}
  _.forEach(results, o => {
    index[o.mid] = o
  })
  return keys.map(key => {
    return index[key]
  })
}
// 유효한 티켓
async function batchValidTicket (Ticket, keys) {
  const date = new Date(`${moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')}:00.000Z`)
  const $query = {
    memberid: { $in: keys },
    sdate: { $lte: date },
    edate: { $gte: date },
    pay_state: {$in: [1, 4]}
  }
  const results = await Ticket.find($query)
  let index = {}
  _.forEach(results, o => {
    if (!index[o.memberid]) index[o.memberid] = []
    index[o.memberid].push(o)
  })
  return keys.map(key => {
    return index[key]
  })
}

// 기간변경 티켓, key: ticketid
async function batchDelayTicket (DelayTicket, keys) {
  const results = await DelayTicket.find({ticketid: {$in: keys}})
  let index = {}
  _.forEach(results, o => {
    if (!index[o.ticketid]) index[o.ticketid] = []
    index[o.ticketid].push(o)
  })
  return keys.map(key => {
    return index[key]
  })
}

module.exports = (mongo) => {
  return {
    gymLoader: new DataLoader(
      keys => batchGyms(mongo.Gym, keys),
      {cacheKeyFn: key => key.toString(), cache: false}
    ),
    memberLoader: new DataLoader(
      keys => batchMember(mongo.Member, keys),
      {cacheKeyFn: key => key.toString(), cache: false}
    ),
    purchaseLoader: new DataLoader(
      keys => batchPurchase(mongo.Purchase, keys),
      {cacheKeyFn: key => key.toString(), cache: false}
    ),
    validLessonTicketLoader: new DataLoader(
      keys => batchValidTicket(mongo.TicketLesson, keys),
      {cacheKeyFn: key => key.toString(), cache: false}
    ),
    validMembershipTicketLoader: new DataLoader(
      keys => batchValidTicket(mongo.TicketMembership, keys),
      {cacheKeyFn: key => key.toString(), cache: false}
    ),
    delayTicketLoader: new DataLoader(
      keys => batchDelayTicket(mongo.DelayTicket, keys),
      {cacheKeyFn: key => key.toString(), cache: false}
    )
  }
}