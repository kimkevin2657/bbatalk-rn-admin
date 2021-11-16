const _ = require('lodash')
const mongoose = require('mongoose')
const departmentModel = require('../models/defines/departmentSchema')
const inquiryTypeModel = require('../models/defines/inquiryTypeSchema')
const lessonTypeModel = require('../models/defines/lessonTypeSchema')
const membershipModel = require('../models/defines/membershipSchema')
const marketingPathModel = require('../models/defines/marketingPathSchema')
const memberGroupModel = require('../models/defines/memberGroupSchema')
const memberRankModel = require('../models/defines/memberRankSchema')
const memberTypeModel = require('../models/defines/memberTypeSchema')
const rankModel = require('../models/defines/rankSchema')
const regPathModel = require('../models/defines/regPathSchema')
const regTypeModel = require('../models/defines/regTypeSchema')
const roomTypeSchema = require('../models/defines/roomTypeSchema')
const lockerGroupSchema = require('../models/defines/lockerGroupSchema')

const ObjectId = mongoose.Types.ObjectId

const modelDict = {
  department: departmentModel,
  inquiry: inquiryTypeModel,
  lesson: lessonTypeModel,
  membership: membershipModel,
  lockergroup: lockerGroupSchema,
  marketingpath: marketingPathModel,
  membergroup: memberGroupModel,
  memberrank: memberRankModel,
  membertype: memberTypeModel,
  regpath: regPathModel,
  regtype: regTypeModel,
  rank: rankModel,
  room: roomTypeSchema
}

exports.typeDef = `
  """
  관리데이터 유형 정보입니다.
  [type]
    - inquiry: (미구현)
    - marketingpath: (미구현)
    - membertype: 회원 구분 ex) 비회원, 유소년, 정회원 ...
    - memberrank: 회원 등급 ex) VIP, GOLD ...
    - membergroup: 회원 분류 ex) 가족, 단체, 법인 ...
    - regpath: 등록 경로 ex) SNS, 검색, 블로그 ...
    - regtype: (미구현)
    - lesson: 수강권
    - membership: 회원권
    - lockergroup: 락커 그룹
    - department: 부서 구분
    - rank: 직급 구분
    - room: 룸
  """
  type DefineData {
    "DB id"
    _id: String!
    "센터 정보"
    gym: Gym
    "센터 정보 id"
    gymid: String
    "관리데이터 명"
    name: String
    "영어 명"
    eng: String
    "defineData 유형"
    type: String
    "락커 수"
    cnt: Int

    # 수강권, 회원권, 룸
    "담당 부서"
    team: String
    #수강권, 회원권
    "정원"
    peopleCnt: Int
    ""
    duration: Int
    "티켓 기본 금액"
    defPrice: Int
    "환불 기본 금액(1일/1회 금액)"
    refundPrice: Int
    "연장 가능 횟수"
    delayCnt: Int
    "연장 가능 일"
    delayDay: Int
    "일시정지 가능 횟수"
    pauseCnt: Int
    "일시정지 가능 일"
    pauseDay: Int
    "수강권/회원권 상세 정보"
    product: [ProductObj]
    # 회원등급
    "회원 등급 설정 금액"
    rankPrice: Int
    # 기타
    "설명"
    desc: String
    "생성 일자"
    create_d: String
  }

  "수강권/회원권 상세 정보"
  type ProductObj {
    id: String
    "기간(월)"
    month: Int
    "횟수"
    totCnt: Int
    "할인 금액"
    discount: Int
    "가격"
    price: Int
  }

  input inputDefineData {
    _id: String
    gymid: String!
    type: String!
    name: String!
    eng: String
    department: String
    lessonType: String
    cnt: Int              # 락커 수
    # 회원권, 수강권
    peopleCnt: Int
    duration: Int
    team: String
    defPrice: Int
    refundPrice: Int      # 환불 기본 금액(1일/1회 금액)
    delayCnt: Int         # 연장 가능 횟수
    delayDay: Int         # 연장 가능 일
    pauseCnt: Int         # 일시정지 가능 횟수
    pauseDay: Int         # 일시정지 가능 일
    # 회원 등급
    rankPrice: Int        # 회원 등급 설정 금액
    desc: String
    product: [inputProductObj]
    create_d: String
  }

  input inputProductObj {
    id: String
    month: Int
    totCnt: Int
    discount: Int
    price: Int
  }

  extend type Query {
    "관리데이터 중 하나의 유형을 지정하여 모든 데이터를 가져올 수 있습니다."
    allDefineData(gymid: String!, type: String!): [DefineData]
    "관리데이터 중 하나의 유형에서 단일 데이터의 상세 정보를 가져올 수 있습니다."
    findDefineData(_id:String!, type: String!): DefineData
  }

  extend type Mutation {
    "관리데이터를 생성합니다."
    createDefineData(type: String!, input: inputDefineData!): DefineData
    "관리데이터를 편집합니다."
    updateDefineData(_id: String!, type: String!, input: inputDefineData!): DefineData
    "관리데이터를 삭제합니다."
    deleteDefineData(_id: String!, type: String!): DefineData
    "관리데이터를 여러개 삭제합니다."
    bulkDeleteDefineData(type: String!, idList: [String]!): Boolean
  }
`
exports.resolvers = {
  Query: {
    async allDefineData (root, { gymid, type }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`관리데이터의 유형을 찾을 수 없습니다. (type: ${type})`)
      return await modelDict[type].find({ gymid }).sort({ rankPrice: 1, name: 1 }).lean()
    },
    async findDefineData (root, { _id, type }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`관리데이터의 유형을 찾을 수 없습니다. (type: ${type})`)
      return await modelDict[type].findOne({ _id }).lean()
    }
  },
  Mutation: {
    async createDefineData (root, { type, input }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`관리데이터의 유형을 찾을 수 없습니다. (type: ${type})`)
      try {
        return await modelDict[type].create(input)
      } catch (e) {
        if (/E11000/.test(e.toString())) {
          throw new Error('중복되는 데이터가 존재합니다.')
        }
        throw e
      }
    },
    async updateDefineData (root, { _id, type, input }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`관리데이터의 유형을 찾을 수 없습니다. (type: ${type})`)
      return await modelDict[type].findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
    },
    async deleteDefineData (root, { _id, type }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`관리데이터의 유형을 찾을 수 없습니다. (type: ${type})`)
      return await modelDict[type].findOneAndRemove({ _id })
    },
    async bulkDeleteDefineData (root, { type, idList }, ctx) {
      if (!_.has(modelDict, type)) throw new Error(`관리데이터의 유형을 찾을 수 없습니다. (type: ${type})`)
      if (!_.isArray(idList) || idList.length === 0) throw new Error('제거 대상이 없습니다.')
      const removeList = _.map(idList, o => {
        return ObjectId(o)
      })
      const result = await modelDict[type].remove({ _id: { $in: removeList } })
      return true
    }
  },
  DefineData: {
    async gym ({ gymid }, args, ctx) { // 센터 정보를 삽입
      const res = await ctx.mongo.Gym.findOne({ _id: gymid })
      return res
    }
  }
}