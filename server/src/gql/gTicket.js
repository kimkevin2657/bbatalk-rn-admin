const _ = require('lodash')
const mongoose = require('mongoose')
const membershipModel = require('../models/ticket/membershipSchema')
const lessonModel = require('../models/ticket/lessonSchema')
const moment = require('moment')
const { updatePurchase } = require('../queries/qPurchase')
const { ApolloError } = require('apollo-server-express')

const ObjectId = mongoose.Types.ObjectId

const modelDict = {
  membership: membershipModel,
  lesson: lessonModel
}
// type: lesson, membership
exports.typeDef = `
  """
  회원권, 수강권에 대한 형식 입니다.
  """
  type Ticket {
    _id: String!
    # 센터 정보
    gym: Gym
    gymid: String
    # 회원 정보
    memberid: String
    member: Member
    name: String
    engName: String
    special_n: String
    phone: String
    photo: String
    gender: String
    memberType: String
    # 강사 정보
    staffid: String
    staff: Staff
    staffName: String
    staffEng: String
    staffSpecial_n: String
    staffTeam: String
    staffPhoto: String
    # 티켓 정보
    sessionid: String # 세션 정보 id
    productid: String # 세션 상세 정보 id
    session: String
    team: String
    month: Int
    sdate: Date
    edate: Date
    defPrice: Int
    discount: Int
    addDiscount: Int
    price: Int
    peopleCnt: Int
    duration: Int
    totCnt: Int
    useCnt: Int
    chkCnt: Int
    nchkCnt: Int
    # 결제 정보
    priceType: String
    cash: Int
    card: Int
    cardType: String
    cash_r: String
    vat: Int
    point: Int
    purchase: Int
    pay_state: Int        # 티켓 상태, 0: 미결재, 1: 결재, 2: 양도, 3: 환불, 4: 양수
    pay_d: Date
    # 등록 정보
    reg_d: Date
    gifts: [String]
    path: String
    # 기간변경 정보
    delayCnt: Int             # 연장 된 횟수
    pauseCnt: Int             # 일시정지 된 횟수
    # 환불 정보
    refund_reg: Date          # 환불 일자
    refund_cause: String      # 환불 사유
    refund_bank: String       # 은행 명
    refund_account: String    # 계좌
    refund_name: String       # 예금주
    refund_usePrice: Int      # 이용 금액 (실 사용금액
    refund_steal: Int         # 부가 공제액 (사은품 회수액)
    refund_penalty: Int       # 위약금
    refund_point: Int         # 포인트 차감
    refund_price: Int         # 환불 금액 (환급액)
    # ETC
    delayTickets: [DelayTicket] # 기간변경 내역
    input_staff: String
    consult_staff: String
    regPath: String
    desc: String
    create_d: String
  }

  input inputTicket {
    _id: String
    # 센터 정보
    gymid: String
    # 회원 정보
    memberid: String
    name: String
    engName: String
    special_n: String
    phone: String
    photo: String
    gender: String
    memberType: String
    # 강사 정보
    staffid: String
    staffName: String
    staffEng: String
    staffTeam: String
    staffPhoto: String
    staffSpecial_n: String
    # 티켓 정보
    sessionid: String
    productid: String
    session: String
    team: String
    month: Int
    sdate: String
    edate: String
    defPrice: Int
    discount: Int
    addDiscount: Int
    price: Int
    peopleCnt: Int
    duration: Int
    totCnt: Int
    useCnt: Int
    chkCnt: Int
    nchkCnt: Int
    # 결재 정보
    priceType: String
    cash: Int
    card: Int
    cardType: String
    cash_r: String
    vat: Int
    point: Int
    purchase: Int
    pay_state: Int        # 티켓 상태, 0: 미결재, 1: 결재, 2: 양도, 3: 환불
    pay_d: String         # 결제일
    #기타 정보
    reg_d: String
    gifts: [String]
    path: String
    # 기간변경 정보
    delayCnt: Int             # 연장 된 횟수
    pauseCnt: Int             # 일시정지 된 횟수
    # 환불 정보
    refund_reg: Date          # 환불 일자
    refund_cause: String      # 환불 사유
    refund_bank: String       # 은행 명
    refund_account: String    # 계좌
    refund_name: String       # 예금주
    refund_usePrice: Int      # 이용 금액 (실 사용금액)
    refund_steal: Int         # 부가 공제액 (사은품 회수액)
    refund_penalty: Int       # 위약금
    refund_price: Int         # 환불 금액 (환급액)
    refund_point: Int         # 포인트 차감
    # 기타 정보
    input_staff: String
    consult_staff: String
    regPath: String
    desc: String
  }

  type transferTicket {
    transfer: Ticket
    assignor: Ticket
  }

  """
  회원 매출 현황 정보이며 Datatable의 페이지 정보를 갖고 있습니다. (Pagenation)
  """
  type pTicket {
    totCnt: Int # 총 로우 수
    result: [Ticket] # 출입 현황 목록
  }

  extend type Query {
    allTicket(gymid: String!, type: String!, memberid: String, date: String, sessionid: String, isvalid: Boolean): [Ticket]
    findTicket(_id:String!, type: String!): Ticket
    "티켓의 결재 일자를 검색, pagenation 구조"
    pageSalesTicket(gymid: String!, type: String!, from: String!, to: String!, page: Int!, offset: Int!): pTicket
  }

  extend type Mutation {
    createTicket(type: String!, input: inputTicket!, force: Boolean): Ticket
    updateTicket(_id: String!, type: String!, input: inputTicket!, force: Boolean): Ticket
    deleteTicket(_id: String!, type: String!): Ticket
    bulkDeleteTicket(type: String!, idList: [String]!): Boolean
    transferTicket(type: String!, transferInput: inputTicket!, assignorInput: inputTicket!): transferTicket
    refundTicket(_id: String!, type: String!, input: inputTicket!): Ticket
    delayTicket(_id: String!, type: String!, input: inputTicket!, delayInput: inputDelayTicket!): Ticket
  }
`
exports.resolvers = {
  Query: {
    // date는 유효한 티켓 정보를 가져올 때에 사용한다.
    async allTicket (root, { gymid, type, memberid = void 0, date = void 0, sessionid = void 0, isvalid = false }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)
      let $query = { gymid }
      if (isvalid) {  // 유효한 티켓만 가져오도록 쿼리 추가
        $query.pay_state = { $in: [1, 4] }
      }
      if (memberid) $query.memberid = memberid
      if (date) {
        const tempDate = new Date(`${moment(date).format('YYYY-MM-DD HH:mm')}:00.000Z`)
        $query.sdate = { $lte: tempDate }
        $query.edate = { $gte: tempDate }
      }
      if (sessionid) $query.sessionid = sessionid // 관리 데이터 수강권
      return await modelDict[type].find($query).sort({ create_d: -1 }).lean()
    },
    async findTicket (root, { _id, type }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)
      return await modelDict[type].findOne({ _id }).lean()
    },
    /*
     * 티켓의 결재 일자를 검색
     * page: 페이지 번호
     * offset: 한 페이지에 출력되는 로우 수
     */
    async pageSalesTicket (root, { gymid, type, from, to, page = 1, offset = 20 }) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)
      const ticket = modelDict[type]
      const $query = {
        reg_d: {
          $gte: new Date(from),
          $lte: new Date(to)
        },
        gymid: gymid
      }
      const skipCnt = (page - 1) * offset
      return {
        totCnt: await ticket.find($query).count(),
        result: await ticket.find($query).sort({ reg_d: -1 }).skip(skipCnt).limit(offset).lean()
      }
    }
  },
  Mutation: {
    async createTicket (root, { type, input, force = false }, { mongo: { Member } }) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)
      const Ticket = modelDict[type]
      try {
        // 보유 티켓 중 중복기간이 존재하는지 확인
        if (!force) {
          let $query = {
            $and: [
              { memberid: input.memberid },
              { gymid: input.gymid },
              {
                $or: [
                  {
                    sdate: {
                      $gte: new Date(input.sdate),
                      $lt: new Date(input.edate)
                    }
                  },
                  {
                    edate: {
                      $gte: new Date(input.sdate),
                      $lt: new Date(input.edate)
                    }
                  }
                ]
              }
            ]
          }
          if (type === 'lesson') {
            $query.$and.push({ team: input.team })
          }
          const ticket = await Ticket.findOne($query)
          if (ticket) throw new ApolloError(`유효기간이 중첩되는 "${input.session}"이 존재합니다.\n그래도 추가 하시겠습니까?`, 'RETRY_FORCE', { type: type })
        }
        // 포인트를 사용하였다면 사용자의 포인트를 차감
        if (input.point > 0 && input.pay_state === 1) {
          const member = await Member.findOne({ _id: input.memberid })
          if (member.point < input.point) throw new Error('고객님이 소유한 포인트 보다 더 큰 포인트를 사용할 수 없습니다.')
          member.point -= input.point
          member.save()
        }
        const result = await Ticket.create(input)
        updatePurchase(input.memberid, input.gymid) // 구매 통계 실행(Trigger)
        return result
      } catch (e) {
        if (/E11000/.test(e.toString())) {
          throw new Error('중복되는 데이터가 존재합니다.')
        }
        throw e
      }
    },
    async updateTicket (root, { _id, type, input, force = false }, { mongo: { Member } }) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)
      const Ticket = modelDict[type]
      // 보유 티켓 중 중복기간이 존재하는지 확인
      if (!force) {
        let $query = {
          $and: [
            { _id: { $ne: _id } },
            { memberid: input.memberid },
            { gymid: input.gymid },
            {
              $or: [
                {
                  sdate: {
                    $gte: new Date(input.sdate),
                    $lt: new Date(input.edate)
                  }
                },
                {
                  edate: {
                    $gte: new Date(input.sdate),
                    $lt: new Date(input.edate)
                  }
                }
              ]
            }
          ]
        }
        if (type === 'lesson') {
          $query.$and.push({ team: input.team })
        }
        const ticket = await Ticket.findOne($query)
        if (ticket) throw new ApolloError(`유효기간이 중첩되는 "${input.session}"이 존재합니다.\n그래도 수정 하시겠습니까?`, 'RETRY_FORCE', { type: type })
      }
      // 포인트를 사용하였다면 사용자의 포인트를 차감
      const ticket = await Ticket.findOne({ _id })
      if (input.point > 0 && input.pay_state === 1 && ticket.pay_state === 0) {
        const member = await Member.findOne({ _id: input.memberid })
        if (member.point < input.point) throw new Error('고객님이 소유한 포인트 보다 더 큰 포인트를 사용할 수 없습니다.')
        member.point -= input.point
        member.save()
      }
      try {
        const result = await Ticket.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
        updatePurchase(input.memberid, input.gymid) // 구매 통계 실행(Trigger)
        return result
      } catch (e) {
        throw e
      }
    },
    async deleteTicket (root, { _id, type }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)
      try {
        const result = await modelDict[type].findOneAndRemove({ _id })
        updatePurchase(result.memberid, result.gymid) // 구매 통계 실행(Trigger)
        return result
      } catch (e) {
        throw e
      }

    },
    async bulkDeleteTicket (root, { type, idList }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)
      if (!_.isArray(idList) || idList.length === 0) throw new Error('제거 대상이 없습니다.')
      const removeList = _.map(idList, o => {
        return ObjectId(o)
      })
      try {
        const ticket = await modelDict[type].findOne({ _id: idList[0] }, { memberid: 1, gymid: 1 })
        await modelDict[type].remove({ _id: { $in: removeList } })
        updatePurchase(ticket.memberid, ticket.gymid)
        return true
      } catch (e) {
        throw e
      }
    },
    async transferTicket (root, { type, transferInput, assignorInput }, { mongo: { Gym, Member } }) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)
      if (moment().isAfter(moment(assignorInput.edate))) throw new Error('만료되어 양도 할 수 없습니다.')
      const gymData = await Gym.findOne({ _id: transferInput.gymid })
      if (gymData.transferPolicy === 0) throw new Error('양도 정책에 의하여 양도가 불가능합니다.')
      if (gymData.transferPolicy === 2) {
        // 양도자
        const tm = await Member.findOne({ _id: transferInput.memberid })
        const idx = _.findIndex(tm.familyids, (val) => val === assignorInput.memberid)
        if (idx === -1) throw new Error('같은 가족일 경우에만 양도 할 수 있습니다.')
      }
      // 양도자 수정
      const transfer = await modelDict[type].findOneAndUpdate({ _id: transferInput._id }, { $set: transferInput }, { new: true }).lean()
      // 양수자 추가
      let assignor = void 0
      try {
        assignor = await modelDict[type].create(assignorInput)
      } catch (e) {
        if (/E11000/.test(e.toString())) {
          throw new Error('중복되는 데이터가 존재합니다.')
        }
        throw e
      }
      return { transfer, assignor }
    },
    async refundTicket (root, { _id, type, input }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)

      // 위약금 발생여부 확인 유효성검사
      const penaltyTime = moment(input.pay_d).add(24, 'hours')
      if (penaltyTime < new Date() && input.refund_penalty === 0) {
        throw new Error('결재 후 24시간이 지나 위약금이 발생하였습니다. 다시 환불 요청하세요.')
      }

      // 회원에게 포인트 반환
      if (input.refund_point > 0) {
        const member = await mongo.Member.findOne({ _id: input.memberid })
        member.point += input.refund_point
        member.save()
      }
      try {
        const result = await modelDict[type].findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
        updatePurchase(input.memberid, input.gymid) // 구매 통계 실행(Trigger)
        return result
      } catch (e) {
        throw e
      }
    },
    async delayTicket (root, { _id, type, input, delayInput }, { mongo: { DelayTicket, DefineLesson, DefineMembership } }) {
      if (!_.has(modelDict, type)) throw new Error(`티켓 유형을 찾을 수 없습니다. (type: ${type})`)
      try {
        const defineTicket = (type === 'lesson') ? DefineLesson : DefineMembership
        let ticketDefineData = await defineTicket.findOne({ _id: input.sessionid })
        if (!ticketDefineData) throw new Error('티켓 관련 관리데이터를 찾을 수 없습니다.')
        let delayTickets = await DelayTicket.find({ ticketid: _id, type: delayInput.type })
        if (delayInput.type === 'delay') {
          // 연장 가능 횟수가 0일때
          if (!ticketDefineData.delayCnt) {
            throw new Error('연장 가능 횟수가 설정되어 있지 않습니다.')
          }
          // 연장 가능 일이 0일때
          if (!ticketDefineData.delayDay) {
            throw new Error('연장 가능 일이 설정되어 있지 않습니다.')
          }
          // 연장 횟수를 확인하여 초과 유무 체크
          if (ticketDefineData.delayCnt <= _.size(delayTickets)) {
            throw new Error('연장 가능 횟수를 초과하였습니다.')
          }
        } else if (delayInput.type === 'pause') {
          // 일시정지 가능 횟수가 0 또는 없을 때
          if (!ticketDefineData.pauseCnt) {
            throw new Error('일시정지 가능 횟수가 설정되어 있지 않습니다.')
          }
          // 일시정지 가능 일이 0 또는 없을 때
          if (!ticketDefineData.pauseDay) {
            throw new Error('일시정지 가능 일이 설정되어 있지 않습니다.')
          }
          // 일시정지 횟수를 확인하여 초과 유무 체크
          if (ticketDefineData.pauseCnt <= _.size(delayTickets)) {
            throw new Error('일시정지 가능 횟수를 초과하였습니다.')
          }

          // 일시정지일 요청 중 겹치는 부분이 존재하는지 확인
          const reqPauseStart = delayInput.pause_sdate
          const reqPauseEnd = delayInput.pause_edate
          for (let i = 0; i < _.size(delayTickets); i++) {
            const delayTicket = delayTickets[i]
            const pauseStart = moment(delayTicket.pause_sdate).format('YYYY-MM-DD')
            const pauseEnd = moment(delayTicket.pause_edate).format('YYYY-MM-DD')
            let isRangeExist = false
            if (moment(reqPauseStart).isBetween(pauseStart, pauseEnd, null, "[]")) {
              isRangeExist = true
            }
            if (moment(reqPauseEnd).isBetween(pauseStart, pauseEnd, null, "[]")) {
              isRangeExist = true
            }
            if (isRangeExist) {
              throw new Error(`일시정지일이 중첩되어 요청에 실패하였습니다. (${pauseStart} ~ ${pauseEnd})`)
            }
          }
        }

        DelayTicket.create(delayInput)
        return await modelDict[type].findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
      } catch (e) {
        throw e
      }
    }
  },
  Ticket: {
    async gym ({ gymid }, args, ctx) { // 상세 센터 정보를 주입
      const res = await ctx.mongo.Gym.findOne({ _id: gymid })
      return res
    },
    async member ({ memberid }, args, ctx) { // 상세 회원 정보를 주입
      const res = await ctx.mongo.Member.findOne({ _id: memberid })
      return res
    },
    async staff ({ staffid }, args, ctx) { // 상세 강사 정보 주입
      const res = await ctx.mongo.Staff.findOne({ _id: staffid })
      return res
    },
    async delayTickets ({ _id }, args, { loaders: { delayTicketLoader } }) {  // 기간변경 정보 가져오기
      const result = await delayTicketLoader.load(_id)
      if (!result) return []
      return result
    }
  }
}
