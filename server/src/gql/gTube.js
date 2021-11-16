const youtube = require('../libs/youtube')
const _ = require('lodash')
exports.typeDef = `
  """
  Youtube 영상에 대한 형식 정보 입니다.
  """
  type Tube {
    _id: String
    key: String!
    gym: Gym
    gymid: String!
    title: String
    description: String
    channelTitle: String
    tags: [String]
    publishedAt: String
    create_d: String
  }

  input inputTube {
    key: String!
    gymid: String!
  }

  extend type Query {
    allTube: [Tube]
    findTube(_id:String!): Tube
  }

  extend type Mutation {
    createTube(input: inputTube!): Tube
    deleteTube(key: String!): Tube
  }
`
exports.resolvers = {
  Query: {
    async allTube (root, args, ctx) {
      return await ctx.mongo.Tube.find(args).sort({ _id: -1 }).lean()
    },
    async findTube (root, args, ctx) {
      return await ctx.mongo.Tube.findOne(args).lean()
    }
  },
  Mutation: {
    async createTube (root, { input }, ctx) {
      if (!_.has(input, 'key')) throw new Error('동영상 키가 없습니다.')
      // Key 중복 여부 확인
      try {
        tube = await ctx.mongo.Tube.findOne({ key: input.key })
      } catch (e) {
        throw e
      }

      let vedioInfo = void 0
      vedioInfo = await youtube.vedioInfo(input.key)
      if (!vedioInfo) throw new Error('동영상을 찾을 수 없습니다.')
      vedioInfo.key = input.key
      vedioInfo.gymid = input.gymid
      let tube = void 0
      if (tube) throw '이미 존재하는 동영상 입니다.'
      return await ctx.mongo.Tube.create(vedioInfo)
    },
    async deleteTube (root, { key }, ctx) {
      return await ctx.mongo.Tube.findOneAndDelete({ key })
    }
  },
  Tube: { // 센터 정보를 삽입
    async gym ({ gymid }, args, ctx) {
      const res = await ctx.mongo.Gym.findOne({ _id: gymid })
      return res
    }
  }
}