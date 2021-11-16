const _ = require('lodash')
const mongoose = require('mongoose')
const moment = require('moment')

const ObjectId = mongoose.Types.ObjectId

// type: lesson, membership
exports.typeDef = `
  """
  회원이 센터에 입장할 때의 정보에 대한 형식입니다.
  """
  type MemberAccess {
    _id: String
    # 센터 정보
    gym: Gym
    gymid: String
    # 회원 정보
    memberid: String
    member: Member
    name: String
    engName: String
    special_n: String
    # 티켓 정보
    ticketid: String                  # 티켓 정보 id
    ticketName: String
    lessonTickets: [Ticket]           # 유효 수강권 목록
    membershipTickets: [Ticket]       # 유효 회원권 목록
    reserves: [ReserveSchedule]       # 금일 예약한 내역
    # 입장 정보
    type: String                      # 입장 유형, (membership, lesson)
    # 기타 정보
    create_d: Date
  }
  
  """
  회원이 센터에 입장한 현황 정보이며 Datatable의 페이지 정보를 갖고 있습니다. (Pagenation)
  총 출입 수와 요청 페이지의 목록을 담는 형식입니다.
  """
  type pMemberAccess {
    totCnt: Int # 총 로우 수
    result: [MemberAccess] # 출입 현황 목록
  }

  input inputMemberAccess {
    _id: String
    # 센터 정보
    gymid: String
    # 회원 정보
    memberid: String
    name: String
    engName: String
    special_n: String
    # 티켓 정보
    ticketid: String
    ticketName: String
    # 입장 정보
    type: String             # 입장 유형, (membership, lesson)
    # 기타 정보
    input_staff: String
  }

  extend type Query {
    allMemberAccess(gymid: String!, memberid: String, ticketid: String, page: Int, offset: Int, year: Int): pMemberAccess
    findMemberAccess(_id: String, specialn: Int, gymid: String): MemberAccess
  }

  extend type Mutation {
    createMemberAccess(input: inputMemberAccess): MemberAccess
  }
`
exports.resolvers = {
  Query: {
    /**
     * 출입 현황 목록을 가져온다.
     * page: 페이지 번호
     * offset: 한 페이지에 출력되는 로우 수
     * year: 년도 단위로 컬렉션이 분할 되어 있으며 요청하는 년도 정보로 출력
     */
    async allMemberAccess (root, {
      gymid,
      memberid = void 0,
      ticketid = void 0,
      page = 1,
      offset = 20,
      year = new Date().getFullYear()
    }, { mongo }) {
      const modelName = `${year}-memberAccess`
      const model = mongo[modelName]
      if (!model) throw new Error(`${year}년도 정보가 없습니다.`)
      let $query = { gymid }
      if (memberid) $query.memberid = memberid
      if (ticketid) $query.ticketid = ticketid
      const skipCnt = (page - 1) * offset
      return {
        totCnt: await model.find($query).count(),
        result: await model.find($query).sort({ _id: -1 }).skip(skipCnt).limit(offset).lean()
      }
    },
    /**
     * 회원이 접근 시에 유효한 이용권을 가지고 있는 경우에만 입장 할 수
     * 있도록 유효성 검사 수행 후 출입 로그를 추가 한다.
     * 또한 관련 정보 반환
     * [유효성 검사 단계]
     *  1. 존재하는 회원인지 확인
     *  2. 회원권이 있다면 유효성 검사 통과, 없다면 3. 진행
     *  3. 예약 현황 중 입장 시간의 오차범위 체크 (gym.accessRange를 확인)
     * 위 유효성 검사를 통과한 후에는 접근 정보를 로그로 남기며 반환하여 준다.
     */
    async findMemberAccess (root, { _id, specialn, gymid }, { mongo }) {
      const time = new Date()
      const year = time.getFullYear()
      const modelName = `${year}-memberAccess`
      const model = mongo[modelName]
      if (!model) throw new Error(`${year}년도 정보가 없습니다.`)
      // 1. 존재하는 회원인지 확인
      const member = await mongo.Member.findOne({ gymid, special_n: specialn }).lean()
      if (!member) throw new Error('회원님의 정보를 찾을 수 없습니다.')
      // 유효 티켓 확인
      const date = new Date(`${moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')}:00.000Z`)
      const $query = {
        memberid: member._id,
        sdate: { $lte: date },
        edate: { $gte: date },
        pay_state: { $in: [1, 4] }
      }
      const lessonTickets = await mongo.TicketLesson.find($query)
      const membershipTickets = await mongo.TicketMembership.find($query)
      // 센터 정보 확인
      const gym = await mongo.Gym.findOne({ _id: gymid })
      if (!gym) throw new Error('센터 정보를 찾을 수 없습니다.')
      // 에약 현황 정보 
      const rTime = moment()
      const reserves = await mongo.ReserveSchedule.find({
        memberid: member._id, stime: {
          $gte: rTime.format('YYYY-MM-DD 00:00:00'),
          $lt: rTime.format('YYYY-MM-DD 23:59:59')
        }
      })

      if (!lessonTickets && !membershipTickets) throw new Error('유효한 이용권이 없습니다.')

      // 2,3 회원권 및 예약 현황 확인
      let ticketid, ticketName, type
      if (_.size(membershipTickets) === 0 && _.size(reserves) === 0) {
        throw new Error('보유한 회원권 또는 예약 현황이 없습니다.')
      } else if (_.size(membershipTickets) > 0) {
        const ticket = membershipTickets[0]
        ticketid = ticket._id
        ticketName = ticket.session
        type = 'membership'
      } else if (_.size(reserves) > 0) {
        // 예약한 부분 시간 체크
        let currentTime = moment()
        let isValid = false
        let enableTimes = []  // 접속 가능 시간
        _.forEach(reserves, reserve => {
          if (reserve.state !== 1) return // 예약된 상태가 아니라면 확인할 필요가 없으므로 패스
          const range = gym.accessRange // 분 단위
          let startTime = moment(reserve.stime).add(-(range), 'minutes')
          let endTime = moment(reserve.etime)
          const isCheck = currentTime.isBetween(startTime, endTime, 'minutes', '[)')
          if (isCheck) {
            isValid = true
            ticketid = reserve.ticketid
            ticketName = reserve.tName
            type = 'lesson'
          }
          enableTimes.push(`${startTime.format('HH:mm')} ~ ${endTime.format('HH:mm')}`)
        })
        if (!isValid) {
          return new Error(`입장이 불가능한 시간입니다. (가능시간: ${enableTimes.join(', ')})`)
        }
      }
      return {
        gymid,
        memberid: member._id,
        name: member.name,
        engName: member.engName,
        special_n: member.special_n,
        ticketid,
        ticketName,
        type
      }
    },
  },
  Mutation: {
    async createMemberAccess (root, { input }, { mongo }) {
      const time = new Date()
      const year = time.getFullYear()
      const modelName = `${year}-memberAccess`
      const model = mongo[modelName]
      if (!model) throw new Error(`${year}년도 정보가 없습니다.`)
      const member = await model.create(input)
      return member
    },
  },
  MemberAccess: {
    async gym ({ gymid }, args, { mongo: { Gym } }) { // 상세 센터 정보를 주입
      const res = await Gym.findOne({ _id: gymid })
      return res
    },
    async member ({ memberid }, args, { mongo: { Member } }) { // 상세 회원 정보를 주입
      const res = await Member.findOne({ _id: memberid })
      return res
    },
    async lessonTickets ({ memberid }, args, { loaders: { validLessonTicketLoader } }) {
      return await validLessonTicketLoader.load(memberid)
    },
    async membershipTickets ({ memberid }, args, { loaders: { validMembershipTicketLoader } }) {
      return await validMembershipTicketLoader.load(memberid)
    },
    async reserves ({ memberid }, args, { mongo: { ReserveSchedule } }) {
      const rTime = moment()
      return await ReserveSchedule.find({
        memberid, stime: {
          $gte: rTime.format('YYYY-MM-DD 00:00:00'),
          $lt: rTime.format('YYYY-MM-DD 23:59:59')
        }
      })
    }
  }
}