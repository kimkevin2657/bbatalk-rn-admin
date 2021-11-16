const { notice } = require("../../libs/logger")
const utils = require('../../libs/utils')

exports.typeDef = `
  "운영 게시판"
  type OperationNotice {
    "게시글 번호"
    num: Int
    "작성자"
    name: String
    "게시글 id"
    _id: String
    "게시글 제목"
    title: String
    "게시글 내용"
    content: String
    "센터 정보"
    gym: Gym
    "센터 id"
    gymid: String
    "댓글"
    comments: [ONComment]
    "조회수"
    see: Int
    "생성일자"
    create_d: Date
  }

  type ONComment {
    "댓글 id"
    _id: String
    "댓글 작성자"
    name: String
    "댓글"
    comment: String
  }

  input inputOperationNotice {
    gymid: String
    name: String
    title: String
    content: String
    pwd: String
  }
  input inputONComment {
    name: String
    comment: String
    pwd: String
  }

  extend type Query {
    allOperationNotice(gymid: String!): [OperationNotice]
    findOperationNotice(gymid: String!, num: Int!): OperationNotice
    checkOperationNoticePwd(_id: String!, pwd: String!): Boolean
  }

  extend type Mutation {
    createOperationNotice(input: inputOperationNotice!): OperationNotice
    updateOperationNotice(_id: String!, input: inputOperationNotice!): OperationNotice
    deleteOperationNotice(_id: String!, pwd: String!): OperationNotice
  }
`

exports.resolvers = {
  Query: {
    async allOperationNotice (root, { gymid }, { mongo: { OperationNotice } }) {
      let query = { gymid }
      let projection = { _id: 1, num: 1, title: 1, gymid: 1, name: 1, see: 1, create_d: 1 }
      let dataList = await OperationNotice.find(query, projection).sort({ _id: -1 }).lean()
      return dataList
    },
    async findOperationNotice (root, args, { mongo: { OperationNotice } }) {
      await OperationNotice.findOneAndUpdate(args, { $inc: { see: 1 } })
      let data = await OperationNotice.findOne(args).lean()
      return data
    },
    async checkOperationNoticePwd (root, { _id, pwd }, { mongo: { OperationNotice } }) {
      let noticeData = await OperationNotice.findOne({ _id }, { salt: 1, hashPassword: 1 })
      const { hashPassword } = utils.saltHashPassword(pwd, noticeData.salt)
      if (hashPassword !== noticeData.hashPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.')
      }
      return true
    }
  },
  Mutation: {
    async createOperationNotice (root, { input }, { mongo: { OperationNotice, Counter } }) {
      // 번호 추출
      let counterForm = { name: 'OperationNotice', gymid: input.gymid }
      let counter = await Counter.findOne(counterForm) || new Counter(counterForm)
      // 비밀번호 해쉬와 salt로 분리
      const { hashPassword, salt } = utils.saltHashPassword(input.pwd)
      input.salt = salt
      input.hashPassword = hashPassword
      input.num = ++counter.cnt
      let noticeData = await OperationNotice.create(input)
      // console.log(counter)
      await counter.save()
      return noticeData
    },
    async updateOperationNotice (root, { _id, input }, { mongo: { OperationNotice } }) {
      let noticeData = await OperationNotice.findOne({ _id }, { salt: 1, hashPassword: 1 })
      const { hashPassword } = utils.saltHashPassword(input.pwd, noticeData.salt)
      if (hashPassword !== noticeData.hashPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.')
      }
      return await OperationNotice.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
    },
    async deleteOperationNotice (root, { _id, pwd }, { mongo: { OperationNotice } }) {
      let noticeData = await OperationNotice.findOne({ _id }, { salt: 1, hashPassword: 1 })
      const { hashPassword } = utils.saltHashPassword(pwd, noticeData.salt)
      if (hashPassword !== noticeData.hashPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.')
      }
      return await OperationNotice.findOneAndRemove({ _id })
    }
  },
  OperationNotice: {
    async gym ({ gymid }, args, { mongo: { Gym } }) { // 상세 센터 정보를 주입
      const res = await Gym.findOne({ _id: gymid })
      return res
    }
  }
}
