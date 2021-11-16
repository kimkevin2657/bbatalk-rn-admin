const _ = require('lodash')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId
exports.typeDef = `
  """
  락커 그룹에 대한 정보 형식 입니다.
  """
  type LockerGroup {
    _id: ID
    gymid: ID
    gym: Gym
    name: String
    desc: String
  }

  input inputLockerGroup {
    _id: ID
    gymid: ID!
    name: String!
    desc: String
  }

  extend type Query {
    allLockerGroup(gymid: String!): [LockerGroup]
    findLockerGroup(_id:String!): LockerGroup
  }

  extend type Mutation {
    createLockerGroup(input: inputLockerGroup!): LockerGroup
    updateLockerGroup(_id: String!, input: inputLockerGroup!): LockerGroup
    deleteLockerGroup(_id: String!): LockerGroup
    bulkDeleteLockerGroup(idList: [String]!): Boolean
  }
`

exports.resolvers = {
  Query: {
    async allLockerGroup (root, { gymid }, { mongo: { LockerGroup } }) {
      let query = { gymid }
      let dataList = await LockerGroup.find(query).lean()
      return dataList
    },
    async findLockerGroup (root, args, { mongo: { LockerGroup } }) {
      let data = await LockerGroup.findOne(args).lean()
      return data
    }
  },
  Mutation: {
    async createLockerGroup (root, { input }, { mongo: { LockerGroup } }) {
      const dataUrl = input.photo
      try {
        lockerGroup = await LockerGroup.findOne({
          name: input.name
        })
      } catch (e) {
        throw e
      }
      if (lockerGroup) throw new Error('이미 존재하는 락커 그룹명 입니다.')
      let lockerGroupData = await LockerGroup.create(input)
      return lockerGroupData
    },
    async updateLockerGroup (root, { _id, input }, { mongo: { LockerGroup } }) {
      let lockerGroup = void 0
      try {
        lockerGroup = await LockerGroup.findOne({
          $and: [
            { _id: { $ne: _id } },
            { name: input.name },
          ]
        })
      } catch (e) {
        throw e
      }
      if (lockerGroup) throw new Error('이미 존재하는 락커 그룹명 입니다.')
      let lockerGroupData = await LockerGroup.findOneAndUpdate({ _id }, { $set: input }, { new: true }).lean()
      return lockerGroupData
    },
    async deleteLockerGroup (root, { _id }, { mongo: { LockerGroup } }) {
      return await LockerGroup.findOneAndRemove({ _id })
    },
    async bulkDeleteLockerGroup (root, { idList }, { mongo: { LockerGroup } }) {
      if (!_.isArray(idList) || idList.length === 0) throw new Error('제거 대상이 없습니다.')
      const removeList = _.map(idList, o => {
        return ObjectId(o)
      })
      await LockerGroup.remove({ _id: { $in: removeList } })
      return true
    }
  },
  LockerGroup: {
    async gym ({ gymid }, args, { loaders: { gymLoader } }) { // 센터 정보를 삽입
      return await gymLoader.load(gymid)
    }
  }
}

