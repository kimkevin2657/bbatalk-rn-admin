let jwt = require("jsonwebtoken");
let secretObj = require("../../config/jwt");
const logger = require('./logger');
/**
 * Router의 인증을 위한 미들웨어
 */
function authenticate (req, res, next) {
  const ip = req.connection.remoteAddress
  if (ip === '127.0.0.1') return next()
  if (!req.cookies || !req.cookies.user) return res.status(401).send("권한이 없습니다.")

  try {
    let token = req.cookies.user
    let decoded = jwt.verify(token, secretObj.secret)
    if(decoded){
      next()
    }
    else{
      res.status(401).send("권한이 없습니다.")
      // res.status(401).send("권한이 없습니다.")
    }
  } catch (e) {
    logger.error(e)
    res.status(401).send("권한이 없습니다.")
  }
  
}

/**
 * Router의 요청에 대한 로그를 남겨주는 역할
 * log format: [요청 방식] url (IP): data
 */
function reqLog(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const method = req.method
  const url = req.url
  if (/login/.test(url) || /member/.test(url)) {
    logger.info(`[${method}] ${decodeURI(url)} (${ip})`)
  } else if (['PUT', 'POST'].indexOf(method) >= 0) {
    logger.info(`[${method}] ${decodeURI(url)} (${ip})`)
  } else {
    logger.info(`[${method}] ${decodeURI(url)} (${ip}): ${JSON.stringify(req.query)}`)
  }
  next()
}
module.exports = {
  authenticate,
  reqLog
}