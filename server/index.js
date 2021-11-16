'use strict';

const fs = require('fs')
const express = require('express')
const graphlHTTP = require('express-graphql')
const path = require('path')
const os = require('os')
const http = require('http')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const greenlock = require('greenlock-express')
const mongo = require('./src/libs/mongo')
const scheduler = require('./src/libs/scheduler')
const _ = require('lodash')
const logger = require('./src/libs/logger')
const config = require('./config')
// inject GraphQL lib
const api = require('./src/routes/api')
const models = require('./src/models')
const dataloaders = require('./src/libs/dataloaders')
const gql = require('./src/gql')
const middleware = require('./src/libs/middleware')
const authenticate = middleware.authenticate
// monitoring GraphQL
const voyagerMiddleware = require('graphql-voyager/middleware');
// const reqLog = middleware.reqLog

//폴더 없을 경우 생성 (images, data, logs)
fs.readdir(__dirname, (err, files) => {
  if (err) return logger.error(err)
  _.forEach(['images', 'data', 'logs'], dirName => {
    if (files.indexOf(dirName) === -1) {
      fs.mkdirSync(dirName)
    }
  })
})

const app = express();
mongo.start()

app.use(cors());
app.use(bodyParser.json({
  limit: '1mb'
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser())
// app.use(compression())

if (_.get(process, ['env', 'NODE_ENV'], '') !== 'production' || config.graphqldoc) {
  app.use('/doc', express.static(path.join(__dirname, 'doc/graphql')))
}
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'images')))

// GraphQL 연동부
let isGraphiql = false
if (_.get(process, ['env', 'NODE_ENV'], '') !== 'production' || config.graphiql) {
  isGraphiql = true
}
app.use(`/graphql`, authenticate, graphlHTTP({
  schema: gql,
  graphiql: isGraphiql,
  context: {
    mongo: models,
    loaders: dataloaders(models)
  }
}))

if (_.get(process, ['env', 'NODE_ENV'], '') !== 'production' || config.voyager) {
  // GraphQL Voyager 모델 뷰어, http://localhost:3000/voyager
  app.use('/voyager', voyagerMiddleware.express({ endpointUrl: '/graphql' }))
}
// RestAPI 연동부
app.use('/api', api)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

const port = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'develop'
app.set('port', port);
const server = http.createServer(app);
server.listen(port, '0.0.0.0', () => {
  logger.info(`API running on 0.0.0.0:${port}`)
  scheduler.startScheduler();
});

// https 서버
// if (_.get(process, ['env', 'NODE_ENV'], '') === 'production') {
//   const server = greenlock.create({
//     server: "https://acme-v02.api.letsencrypt.org/directory",
//     version: 'draft-11', // 버전2
//     store: require("le-store-certbot").create({
//       configDir: path.join(os.homedir(), "acme", "etc"),
//       webrootPath: "/tmp/acme-challenges"
//     }),
//     agreeTos: true,
//     approveDomains: ['ffaso.com', 'www.ffaso.com', 'fit.ffaso.com'],
//     email: 'love4langhe@naver.com',
//     app: app,
//     renewWithin: 81 * 24 * 60 * 60 * 1000,
//     renewBy: 80 * 24 * 60 * 60 * 1000
//   })

//   server.listen(80, 443, () => { // http, https 포트
//     process.env.NODE_ENV = 'production'
//     logger.info(`Listening on port 443 for ACME challenges and 443 for express app.`)
//     scheduler.startScheduler();
//   });
// } else {
//   const port = process.env.PORT || 3000;
//   app.set('port', port);
//   const server = http.createServer(app);
//   server.listen(port, '0.0.0.0', () => {
//     process.env.NODE_ENV = 'develop'
//     logger.info(`API running on 0.0.0.0:${port}`)
//     scheduler.startScheduler();
//   });
// }
