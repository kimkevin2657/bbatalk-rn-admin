const moment = require('moment')
exports.typeDef = `
  "피트니스 센터 정보"
  type Gym {
    "센터 id"
    _id: String
    "센터 명"
    name: String
    "센터 소유자(관리자 계정 ID)"
    mid: String
    "영업 시작 시간"
    stime: String
    "영업 종료 시간"
    etime: String
    "센터 설명"
    desc: String,
    "회원 등급 누적 형식(0: 없음, 1: 년 단위 누적, 2: 전체 누적)"
    memberRank: Int
    "양도 정책(0: 양도 불가, 1: 모두에게 양도, 2: 가족에게만 양도 가능)"
    transferPolicy: Int
    "양도비 설정"
    transferPee: Int
    "출입 오차 범위 시간 (분)"
    accessRange: Int
    "생성일"
    create_d: String
  }

  input inputGym {
    name: String
    stime: String
    etime: String
    desc: String
    memberRank: Int
    transferPolicy: Int
    transferPee: Int
    accessRange: Int
  }
  extend type Query {
    """
    모든 휘트니스 센터 정보를 가져옵니다.
    """
    allGym(mid: String): [Gym]
    "단일 휘트니스 센터 정보를 상세하게 가져옵니다."
    findGym(_id: String, name: String): Gym
  }
  
  extend type Mutation {
    "단일 휘트니스 정보를 편집합니다."
    updateGym(_id: String, input: inputGym): Gym
    "단일 휘트니스 정보를 제거합니다."
    deleteGym(_id: String): Gym
  }
`
exports.resolvers = {
  Query: {
    async allGym (root, args, ctx) {
      return await ctx.mongo.Gym.find(args)
    },
    async findGym (root, args, ctx) {
      return await ctx.mongo.Gym.findOne(args)
    }
  },
  Mutation: {
    async updateGym (root, { _id, input }, ctx) {
      // 영업시간 유효성 검사
      const stime = moment(input.stime, 'hh:mm')
      const etime = moment(input.etime, 'hh:mm')
      if (stime > etime) throw new Error('영업시간의 설정이 잘못되었습니다.')
      return await ctx.mongo.Gym.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
    },
    async deleteGym (root, { _id }, ctx) {
      return await ctx.mongo.Gym.findOneAndDelete({ _id })
    }
  }
}