const _ = require('lodash')
const util = require('../libs/utils')
exports.typeDef = `
  """
  강사 정보에 대한 형식입니다.
  """
  type Staff {
    _id: String
    gym: Gym
    gymid: String
    # 기본 정보
    special_n: String
    photo: String
    isLeave: Boolean
    name: String
    engName: String
    gender: String
    phone: String
    email: String
    birth: String
    address_f: String
    address_l: String
    team: String
    level: String
    # 권한
    isOperation: Boolean
    # 선임 강사
    senior: Staff
    seniorid: String
    # 경력
    career: String
    certificate: String
    # SNS
    instarid: String
    facebookid: String
    youtubeid: String
    blog: String
    homepage: String
    # 급여 정보
    bank_n: String
    account_n: String
    account_h: String
    # ETC
    memo: String
    score: Int
    regDate: Date
    create_d: Date
  }

  input inputStaff {
    gymid: String!
    special_n: String
    isLeave: Boolean
    name: String
    engName: String
    gender: String
    phone: String
    email: String
    birth: String
    address_f: String
    address_l: String
    team: String
    level: String
    isOperation: Boolean
    seniorid: String
    photo: String
    career: String
    certificate: String
    instarid: String
    facebookid: String
    youtubeid: String
    blog: String
    homepage: String
    bank_n: String
    account_n: String
    account_h: String
    memo: String
    score: Int
    regDate: String
  }

  extend type Query {
    allStaff(gymid: String!): [Staff]
    findStaff(_id:String!): Staff
  }

  extend type Mutation {
    createStaff(input: inputStaff!): Staff
    updateStaff(_id: String!, input: inputStaff!): Staff
    deleteStaff(_id: String!): Staff
    bulkDeleteStaff(idList: [String]!): Boolean
  }
`
exports.resolvers = {
  Query: {
    async allStaff (root, args, ctx) {
      let dataList = await ctx.mongo.Staff.find(args).lean()
      return dataList
    },
    async findStaff (root, args, ctx) {
      let data = await ctx.mongo.Staff.findOne(args).lean()
      return data
    }
  },
  Mutation: {
    async createStaff (root, { input }, ctx) {
      const dataUrl = input.photo
      if (/^data:./.test(dataUrl)) {
        // dataUrl -> file image 변환 위치 지정
        input.photo = util.getImageFileName('staff', input.gymid, input.special_n, dataUrl)
      }
      let staff = void 0
      try {
        staff = await ctx.mongo.Staff.findOne({
          $and: [
            { phone: input.phone },
            { gymid: input.gymid }
          ]
        })
      } catch (e) {
        throw e
      }
      if (staff) throw new Error('이미 존재하는 강사의 연락처 입니다.')
      let staffData = await ctx.mongo.Staff.create(input)
      if (/^data:./.test(dataUrl)) {
        // dataUrl -> file image 변환 위치에 저장
        await util.saveDataUrlToImage(input.photo, dataUrl)
      }
      return staffData
    },
    async updateStaff (root, { _id, input }, ctx) {
      const dataUrl = input.photo
      if (/^data:./.test(dataUrl)) {
        // dataUrl -> file image 변환 위치 지정
        input.photo = util.getImageFileName('staff', input.gymid, input.special_n, dataUrl)
      } else {
        delete input.photo
      }
      let staff = void 0
      try {
        staff = await ctx.mongo.Staff.findOne({
          $and: [
            { _id: { $ne: _id } },
            { phone: input.phone },
            { gymid: input.gymid }
          ]
        })
      } catch (e) {
        throw e
      }
      if (staff) throw new Error('이미 존재하는 강사의 연락처 입니다.')
      let staffData = await ctx.mongo.Staff.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
      if (/^data:./.test(dataUrl)) {
        // dataUrl -> file image 변환 위치에 저장
        await util.saveDataUrlToImage(input.photo, dataUrl)
      }
      return staffData
    },
    async deleteStaff (root, { _id }, ctx) {
      return await ctx.mongo.Staff.findOneAndRemove({ _id })
    },
    async bulkDeleteStaff (root, { idList }, ctx) {
      await ctx.mongo.Staff.remove({ _id: { $in: idList } })
      return true
    }
  },
  Staff: {
    async gym ({ gymid }, args, ctx) { // 센터 정보를 삽입
      const res = await ctx.mongo.Gym.findOne({ _id: gymid })
      return res
    }
  }
}