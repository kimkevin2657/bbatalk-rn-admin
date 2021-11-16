const _ = require('lodash')
const mongoose = require('mongoose')

exports.typeDef = `
  """
  년 단위 로그 관리
  * Partition Log는 년 단위로 생성되는 컬렉션 정보를
  목록화 하여 출력하여 준다.
  * 컬렉션 정보는 "접두어-로그 컬렉션명"의 형식으로 출력
  """
  type PartitionLog {
    name: String  # 컬렉션 명
    year: Int
  }

  extend type Query {
    allPartitionLog(type: String): [PartitionLog]
  }
`

exports.resolvers = {
  Query: {
    allPartitionLog (root, { type = void 0 }, { }) {
      return new Promise((resolve, reject) => {
        mongoose.connection.db.listCollections().toArray(function (err, names) {
          if (err) return reject(err)
          const obj = _.map(names, o => {
            const year = o.name.split(/-/)[0]
            return { name: o.name, year: year }
          }).filter(o => {  // 년도 접두어 체크
            return /^2[0-9]{3}-/.test(o.name)
          }).filter(o => {
            if (!type) return true
            const logName = o.name.split(/^2[0-9]{3}-/)[1]
            if (logName === (type + 's')) return true
            if (logName === (type + 'es')) return true
            return false
          })
          resolve(obj)
        })
      })
    }
  },
  Mutation: {}
}