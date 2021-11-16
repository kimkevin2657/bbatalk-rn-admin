'use strict'

/**
 * [res 코드 처리, res.status]
 * 200, OK, 성공
 * 201, Created, 새로운 Resource 생성에 성공
 * 202, Accepted, Request가 정상적으로 접수
 * 400, Bad Request, Request 데이터에 올바르지 못한 값이 있습니다.
 * 401, Unauthorized, 인증 실패
 * 404, Not Found, Resource가 존재하지 않습니다.
 * 405, Method Not Allowed, Method가 허가되지 않았습니다.
 * 500, Internal Server Error, API 측 문제로 인한 실패입니다.
 * 503, Service Unavailable, 일시적으로 API 접속을 할 수 없습니다.
 */

const express = require('express')
const router = express.Router()

// controller
const gym = require('../controlls/gym')
const user = require('../controlls/user')
const member = require('../controlls/member')
const ticket = require('../controlls/ticket')
const staff = require('../controlls/staff')
const teacher = require('../controlls/teacher')
const manager = require('../controlls/manager')
const schedule = require('../controlls/schedule')
const session = require('../controlls/session')
const locker = require('../controlls/locker')
const room = require('../controlls/room')
const auth = require('../controlls/auth')
const tube = require('../controlls/tube')
const define = require('../controlls/define')
const workTime = require('../controlls/workTime')

// lib
const middleware = require('../libs/middleware')

// 미들웨어
const authenticate = middleware.authenticate
const reqLog = middleware.reqLog

/* 인증 관련 */
router.post('/auth/login', reqLog, auth.login)
router.post('/auth/sendemail', reqLog, auth.sendEmail)
router.get('/auth/authkey', reqLog, auth.checkAuthKey)
router.get('/auth/checkid', reqLog, auth.checkId)
router.post('/auth/member', reqLog, auth.registerMember)
router.get('/auth/check', reqLog, auth.decryptCookie)

/* Gym: 센터 */
router.get('/gym/all', reqLog, authenticate, gym.getAllData)
router.get('/gym', reqLog, authenticate, gym.getData)
router.post('/gym', reqLog, authenticate, gym.addData)
router.put('/gym', reqLog, authenticate, gym.updateData)
router.delete('/gym', reqLog, authenticate, gym.deleteData)

/* Member: 회원 */
router.get('/member/all', reqLog, authenticate, member.getAllData)
router.get('/member', reqLog, authenticate, member.getData)
router.post('/member', reqLog, authenticate, member.addData)
router.put('/member', reqLog, authenticate, member.updateData)
router.delete('/member', reqLog, authenticate, member.deleteData)
router.get('/member/special', reqLog, authenticate, member.genSecialNumber)

/* Ticket: 수강 */
router.get('/ticket/all', reqLog, authenticate, ticket.getAllData)
router.get('/ticket', reqLog, authenticate, ticket.getData)
router.post('/ticket', reqLog, authenticate, ticket.addData)
router.put('/ticket', reqLog, authenticate, ticket.updateData)
router.delete('/ticket', reqLog, authenticate, ticket.deleteData)

/* User: 앱 회원 */
router.get('/user/all', reqLog, authenticate, user.getAllData)
router.get('/user', reqLog, authenticate, user.getData)
router.post('/user', reqLog, authenticate, user.addData)
router.put('/user', reqLog, authenticate, user.updateData)
router.delete('/user', reqLog, authenticate, user.deleteData)

/* Staff: 강사 */
router.get('/staff/all', reqLog, authenticate, staff.getAllData)
router.get('/staff', reqLog, authenticate, staff.getData)
router.post('/staff', reqLog, authenticate, staff.addData)
router.put('/staff', reqLog, authenticate, staff.updateData)
router.delete('/staff', reqLog, authenticate, staff.deleteData)
router.get('/staff/special', reqLog, authenticate, staff.genSecialNumber)

/* Teacher: 앱 강사 */
router.get('/teacher/all', reqLog, authenticate, teacher.getAllData)
router.get('/teacher', reqLog, authenticate, teacher.getData)
router.post('/teacher', reqLog, authenticate, teacher.addData)
router.put('/teacher', reqLog, authenticate, teacher.updateData)
router.delete('/teacher', reqLog, authenticate, teacher.deleteData)

/* Manager: 기업 관리자 */
router.get('/manager/all', reqLog, authenticate, manager.getAllData)
router.get('/manager', reqLog, authenticate, manager.getData)
router.post('/manager', reqLog, authenticate, manager.addData)
router.put('/manager', reqLog, authenticate, manager.updateData)
router.delete('/manager', reqLog, authenticate, manager.deleteData)

/* Schedule: 스케줄 */
router.get('/schedule/all', reqLog, authenticate, schedule.getAllData)
router.get('/schedule', reqLog, authenticate, schedule.getData)
router.post('/schedule', reqLog, authenticate, schedule.addData)
router.put('/schedule', reqLog, authenticate, schedule.updateData)
router.delete('/schedule', reqLog, authenticate, schedule.deleteData)

/* Session: 세션 */
router.get('/session/all', reqLog, authenticate, session.getAllData)
router.get('/session', reqLog, authenticate, session.getData)
router.post('/session', reqLog, authenticate, session.addData)
router.put('/session', reqLog, authenticate, session.updateData)
router.delete('/session', reqLog, authenticate, session.deleteData)

/* Locker: 라커 */
router.get('/locker/all', reqLog, authenticate, locker.getAllData)
router.get('/locker', reqLog, authenticate, locker.getData)
router.post('/locker', reqLog, authenticate, locker.addData)
router.put('/locker', reqLog, authenticate, locker.updateData)
router.delete('/locker', reqLog, authenticate, locker.deleteData)

/* Room: 룸 */
router.get('/room/all', reqLog, authenticate, room.getAllData)
router.get('/room', reqLog, authenticate, room.getData)
router.post('/room', reqLog, authenticate, room.addData)
router.put('/room', reqLog, authenticate, room.updateData)
router.delete('/room', reqLog, authenticate, room.deleteData)

/* Tube: 뽜튜브 */
router.get('/tube/all', reqLog, authenticate, tube.getAllData)
router.get('/tube', reqLog, authenticate, tube.getData)
router.post('/tube', reqLog, authenticate, tube.addData)
router.put('/tube', reqLog, authenticate, tube.updateData)
router.delete('/tube', reqLog, authenticate, tube.deleteData)

/* Dfine: 관리자 데이터 설정 */
router.get('/define/all', reqLog, authenticate, define.getAllData)
router.get('/define', reqLog, authenticate, define.getData)
router.post('/define', reqLog, authenticate, define.addData)
router.put('/define', reqLog, authenticate, define.updateData)
router.delete('/define', reqLog, authenticate, define.deleteData)
router.delete('/define/all', reqLog, authenticate, define.deleteAllData)

/* workTime: 강사 업무 시간 */
router.get('/worktime/all', reqLog, authenticate, workTime.getAllData)
router.get('/worktime', reqLog, authenticate, workTime.getData)
router.post('/worktime', reqLog, authenticate, workTime.addData)
router.put('/worktime', reqLog, authenticate, workTime.updateData)
router.delete('/worktime', reqLog, authenticate, workTime.deleteData)

module.exports = router