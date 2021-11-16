const {
  TicketLesson,      // 수강권
  TicketMembership,  // 회원권
  Purchase           // 구매금 통계
} = require('../models/index')
const _ = require('lodash')

/**
 * 구매 정보 업데이트, 수강권, 회원권 등을 구매하면 유발됨
 * @param {String} mid 
 */
async function updatePurchase (mid, gymid) {
  const membershipTickets = await TicketMembership.find({memberid: mid}, {purchase: 1, pay_state: 1, pay_d: 1, refund_return: 1, refund_price: 1}) // 회원권 구매 정보
  const lessonTickets = await TicketLesson.find({memberid: mid}, {purchase: 1, team: 1, pay_state: 1, pay_d: 1, refund_return: 1, refund_price: 1}) // 수강권 구매 정보
  const productList = [...membershipTickets, ...lessonTickets]
  // 총 구매 금액 계산
  let totPrice = 0
  let unpaidPrice = 0
  let refundPrice = 0
  let yearIndex = {}
  productList.forEach(o => {
    // 0: 미결재, 1: 결재, 2: 양도, 3: 환불, 4: 양수
    if (o.pay_state === 0) {
      unpaidPrice += o.purchase
    } else if ([1, 2, 3, 4].indexOf(o.pay_state) >= 0) {
      const t = new Date(o.pay_d)
      const year = t.getFullYear()
      totPrice += o.purchase
      // 년도 별 구매 금액
      if (yearIndex[year] === void 0) yearIndex[year] = 0
      yearIndex[year] += o.purchase
      // 환불 금액
      if (o.pay_state === 3) {
        refundPrice += o.refund_price
      }
    }
  })
  // 년도별 구매 금액 계산
  const yearPrices = _.map(Object.keys(yearIndex), year => {
    return {year: year, price: yearIndex[year]}
  })
  // 수강 종목 항목 구하기
  let team = {}
  lessonTickets.forEach(o => {
    if ([1,4].indexOf(o.pay_state) >= 0) {
      if (o.team) team[o.team] = 1
    }
  })
  const data = {
    gymid,
    mid,
    totalCnt: productList.length,             // 총 구매 횟수
    lessonCnt: lessonTickets.length,          // 수강권 구매 횟수
    membershipCnt: membershipTickets.length,  // 회원권 구매 횟수
    tPrice: totPrice,                         // 총 결재 금액
    uPrice: unpaidPrice,                      // 총 미수금
    rPrice: refundPrice,                      // 총 환불금
    yPrices: yearPrices,                      // 년도별 결재 금액
    teamList: Object.keys(team)               // 구매한 수강권 종목 리스트
  }

  return await Purchase.findOneAndUpdate(
    {gymid: gymid, mid: mid},
    {$set: data},
    {new: true, upsert: true}
  )
}

module.exports = {
  updatePurchase
}