const _ = require('lodash')
const mongoose = require('mongoose')
const util = require('../libs/utils')
const logger = require('../libs/logger')

const ObjectId = mongoose.Types.ObjectId
exports.typeDef = `
  """
  센터에 등록된 회원에 대한 정보 형식 입니다.
  """
  type Member {
    _id: String!
    gym: Gym
    gymid: String
    special_n: String
    photo: String
    name: String
    engName: String
    gender: String
    ranking: String
    phone: String
    email: String
    regDate: Date
    regType: String
    regPath: String # 등록 경로
    birth: String
    address_f: String
    address_l: String
    memberType: String  # 회원 구분
    memberGroup: [String] # 회원 분류 (입주민, 가족, 단체, 일반 등등...)
    membership: [String]
    lesson: [String]
    youth: [String]
    option: [String]
    point: Int
    familys: [Member] # 회원 가족
    familyids: [String]
    organization: String
    recommender: Member
    recommenderid: String
    carNumber_f: String
    carNumber_l: String
    regMemo: String
    create_d: Date
    # 쿼리 정보
    lessonTickets: [Ticket]           # 유효 수강권 목록
    membershipTickets: [Ticket]       # 유효 회원권 목록
    purchase: Purchase                # 구매 정보
    #memberPriceInfo: memberPriceInfo  # 회원 구매 정보
    #rankInfo: rankInfo                # 회원 등급 정보
  }

  type memberPriceInfo { # 구매 정보
    totalPrice: Int    # 총 구매금
    totalCnt: Int      # 총 구매횟수
    lessonCnt: Int     # 수강강 횟수
    membershipCnt: Int # 회원권 횟수
    teamList: [String] # 수강했던 종목
  }

  type rankInfo {      # 등급 정보
    memberRank: String # 회원 등급
    rankPrice: Int     # 등급 누적 금액
  }

  input inputMember {
    gymid: String!
    special_n: String!
    photo: String
    name: String!
    engName: String
    gender: String
    ranking: String
    phone: String
    email: String
    regDate: String
    regType: String
    regPath: String
    birth: String
    address_f: String
    address_l: String
    memberType: String  # 회원 구분
    memberRank: String  # 회원 등급
    memberGroup: [String] # 회원 분류 (입주민, 가족, 단체, 일반 등등...)
    membership: [String]
    lesson: [String]
    youth: [String]
    option: [String]
    point: Int
    familyids: [String]
    organization: String
    recommenderid: String
    carNumber_f: String
    carNumber_l: String
    regMemo: String
  }

  extend type Query {
    allMember(gymid: String!, name: String): [Member]
    findMember(_id:String!): Member
  }

  extend type Mutation {
    createMember(input: inputMember!): Member
    updateMember(_id: String!, input: inputMember!): Member
    deleteMember(_id: String!): Member
    bulkDeleteMember(idList: [String]!): Boolean
  }
`

exports.resolvers = {
  Query: {
    async allMember (root, { gymid, name }, { mongo: { Member } }) {
      let query = { gymid }
      if (name) {
        query.name = { $regex: name }
      }
      let dataList = await Member.find(query).lean()
      return dataList
    },
    async findMember (root, args, { mongo: { Member } }) {
      let data = await Member.findOne(args).lean()
      return data
    }
  },
  Mutation: {
    async createMember (root, { input }, { mongo: { Member } }) {
      const dataUrl = input.photo
      if (/^data:./.test(dataUrl)) {
        // dataUrl -> file image 변환 위치 지정
        input.photo = util.getImageFileName('member', input.gymid, input.special_n, dataUrl)
      }
      let member = void 0
      try {
        member = await Member.findOne({
          $and: [
            { phone: input.phone },
            { gymid: input.gymid }
          ]
        })
      } catch (e) {
        throw e
      }
      if (member) throw new Error('이미 존재하는 회원의 연락처 입니다.')
      let memberData = await Member.create(input)
      if (/^data:./.test(dataUrl)) {
        // dataUrl -> file image 변환 위치에 저장
        await util.saveDataUrlToImage(input.photo, dataUrl)
      }

      return memberData
    },
    async updateMember (root, { _id, input }, { mongo: { Member } }) {
      const dataUrl = input.photo
      if (/^data:./.test(dataUrl)) {
        // dataUrl -> file image 변환 위치 지정
        input.photo = util.getImageFileName('member', input.gymid, input.special_n, dataUrl)
      } else {
        delete input.photo
      }
      // 핸드폰 번호 중복 체크
      let member = void 0
      try {
        member = await Member.findOne({
          $and: [
            { _id: { $ne: _id } },
            { phone: input.phone },
            { gymid: input.gymid }
          ]
        })
      } catch (e) {
        throw e
      }
      if (member) throw new Error('이미 존재하는 핸드폰 번호 입니다.')
      let memberData = await Member.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
      if (/^data:./.test(dataUrl)) {
        // dataUrl -> file image 변환 위치에 저장
        await util.saveDataUrlToImage(input.photo, dataUrl)
      }

      return memberData
    },
    async deleteMember (root, { _id }, { mongo: { Member } }) {
      return await Member.findOneAndRemove({ _id })
    },
    async bulkDeleteMember (root, { idList }, { mongo: { Member } }) {
      if (!_.isArray(idList) || idList.length === 0) throw new Error('제거 대상이 없습니다.')
      const removeList = _.map(idList, o => {
        return ObjectId(o)
      })
      await Member.remove({ _id: { $in: removeList } })
      return true
    }
  },
  Member: {
    async gym ({ gymid }, args, { loaders: { gymLoader } }) { // 센터 정보를 삽입
      return await gymLoader.load(gymid)
    },
    async familys ({ familyids }, args, { loaders: { memberLoader } }) {
      return await memberLoader.loadMany(familyids)
    },
    async recommender ({ recommenderid }, args, { loaders: { memberLoader } }) {
      if (!recommenderid) return void 0
      return await memberLoader.load(recommenderid)
    },
    async lessonTickets ({ _id }, args, { loaders: { validLessonTicketLoader } }) {
      return await validLessonTicketLoader.load(_id)
    },
    async membershipTickets ({ _id }, args, { loaders: { validMembershipTicketLoader } }) {
      return await validMembershipTicketLoader.load(_id)
    },
    async purchase ({ _id }, args, { loaders: { purchaseLoader } }) {
      const result = await purchaseLoader.load(_id)
      return result
    }
  }
}

