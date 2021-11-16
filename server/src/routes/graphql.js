'use strict'

const graphlHTTP = require('express-graphql')
const gql = require('../gql')
const models = require('../models')
// lib
const middleware = require('../libs/middleware')

// 미들웨어
const authenticate = middleware.authenticate
const reqLog = middleware.reqLog

const graphQLHttp = graphlHTTP({
  schema: gql,
  graphiql: true,
  context: models
})

module.exports = [
  authenticate,
  reqLog,
  graphQLHttp
]
