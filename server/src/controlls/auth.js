const jwt = require('jsonwebtoken')
const _ = require('lodash')
const logger = require('../libs/logger')
// query
const qManager = require('../queries/qManager')
const qTeacher = require('../queries/qTeacher')
const qUser = require('../queries/qUser')
const qAuthKey = require('../queries/qAuthKey')
const qGym = require('../queries/qGym')

const secretObj = require('../../config/jwt')
const mailer = require('../libs/mailer')
const utils = require('../libs/utils')

/**
 *  로그인 요청에 대한 처리.
 *  Json Web Token을 쿠키에 저장되면 다른 api에 대한 권한을 허용해주게 된다.
 *  허용 기간은 1일로 설정됨.
 */
async function login (req, res) {
  const data = req.body
  let authType = void 0
  const manager = await qManager.findOneManager({id: data.id})
  const teacher = await qTeacher.findOneTeacher({id: data.id})
  const user = await qUser.findOneUser({id: data.id})
  let member = void 0
  if (manager) {
    authType = 'manager'
    member = manager
  }
  if (teacher) {
    authType = 'teacher'
    member = teacher
  }
  if (user) {
    authType = 'user'
    member = user
  }
  if (!manager && !teacher && !user) {
    res.status(400).send('계정을 찾을 수 없습니다.')
  }
  
  const {hashPassword} = utils.saltHashPassword(data.password, member.salt)
  if (hashPassword === member.hashPassword) {
    const tokenData = {
      type: authType,
      id: member.id,
      gym: _.get(member, ['gym', 0])
    }
    let token = jwt.sign(tokenData,
      secretObj.secret ,    // 비밀 키
      {
        expiresIn: '1d'    // 유효 시간은 1일
      }
    )
    res.cookie("user", token);
    res.json({
      code: 'ok',
      result: {
        token: token,
        type: authType,
        id: member.id,
        gym: _.get(member, ['gym', 0]),
        member: member
      }
    })
  } else {
    res.status(400).send('비밀번호가 일치하지 않습니다.')
  }
}

/**
 * 이메일 인증 요청
 * 모든 멤버의 메일을 체크 후 문제가 없다면 이메일을 전송하고 사용자에게 알린다.
 */
async function sendEmail (req, res) {
  const email = _.get(req, ['body', 'email'], void 0)
  if (!email) return res.status(400).send('이메일을 전송하지 못하였습니다.')
  const manager = await qManager.findOneManager({email: email})
  const teacher = await qTeacher.findOneTeacher({email: email})
  const user = await qUser.findOneUser({email: email})
  if (manager || teacher || user) {
    res.status(400).send('이미 존재하는 이메일 입니다.')
  }
  
  const key = utils.getRandomInt(1000,9999) // 인증용 키 생성
  // TODO: 키를 생성하여 authKey 콜렉션에 주입한다.
  try {
    await qAuthKey.deleteAuthKey({email: email})
    await qAuthKey.addAuthKey({email: email, key: key})
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send('인증번호 생성에 실패하였습니다.')
    return
  }

  try {
    // TODO: 생성된 키를 이메일로 전송
    const subject = 'Finest 회원 가입 인증 메일입니다.'
    const message = `인증번호 : ${key} 입니다.`
    await mailer.send(email, subject, message)
    res.json({code: 'ok'})
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send('이메일 전송에 실패하였습니다.')
  }
}

/**
 * 인증번호 인증 요청
 * 인증번호 요청을 확인하고 
 */
async function checkAuthKey (req, res) {
  if (!_.has(req, ['query', 'email'])) return res.status(400).send('인증번호가 일치하지 않습니다.')
  // authKey가 정상적인 키 인지 확인
  const authKey = await qAuthKey.findOneAuthKey(req.query)
  // authKey가 존재한다면 인증에 성공
  if (authKey) {
    res.json({code: 'ok'})
  } else {
    res.status(400).send('인증번호가 일치하지 않습니다.')
  }
  
}

/**
 * ID 확인
 */
async function checkId (req, res) {
  const id = _.get(req, ['query', 'id'], void 0)
  if (!_.has(req, ['query', 'id'])) return res.status(400).send('id 속성값을 찾을 수 없습니다.')
  const manager = await qManager.findOneManager({id: id})
  const teacher = await qTeacher.findOneTeacher({id: id})
  const user = await qUser.findOneUser({id: id})
  if (manager || teacher || user) {
    res.status(400).send('이미 존재하는 아이디 입니다.')
  }
  res.json({code: 'ok'})
}

/**
 * 회원 가입 등록
 */
async function registerMember (req, res) {
  const type = _.get(req, ['body', 'type'], void 0) // user, manager, teacher 중 하나
  const data = _.get(req, ['body', 'data'], void 0)
  if (!type || !data || !_.has(data, ['password'])) return res.status(400).send('속성값이 존재 하지 않아 계정을 등록할 수 없습니다.')
  const fnDict = {
    user: qUser.addUser,
    teacher: qTeacher.addTeacher,
    manager: qManager.addManager
  }
  const addMember = fnDict[type]
  // 암호화 처리
  const password = data.password
  const { hashPassword, salt } = utils.saltHashPassword(password)
  data.hashPassword = hashPassword
  data.salt = salt

  // 관리자 추가 부분
  if (type === 'manager') {
    let gym = void 0
    try {
      gym = await qGym.addGym({name: data.gym, mid: data.id})
    } catch (e) {
      logger.error(e.toString())
      res.status(400).send(e.toString())
      return
    }
    
    delete data.gym
    data.gym = [{
      id: gym._id,
      name: gym.name
    }]
  }
  
  try {
    const member = await addMember(data)
    res.json({code: 'ok', result: member})
  } catch (e) {
    logger.error(e.toString())
    res.status(400).send(e.toString())
  }
}

  /**
   * 쿠키값을 해독
   */
  async function decryptCookie (req, res) {
    let token = req.cookies.user
    let decoded
    try {
      decoded = jwt.verify(token, secretObj.secret)
      if (!decoded) return res.status(400).send('정보를 확인할 수 없습니다.')
    } catch (e) {
      logger.error(e.toString())
      res.status(400).send(e.toString())
      return
    }
    res.json({code: 'ok', result: decoded})
  }

module.exports = {
  login,
  sendEmail,
  checkAuthKey,
  checkId,
  registerMember,
  decryptCookie
}