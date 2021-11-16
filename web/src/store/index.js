import Vue from 'vue'
import Vuex from 'vuex'

// modules
import common from './module/common'
import inquiry from './module/inquiry'
import userSettings from './module/userSettings'
import community from './module/community'

// auth - 인증
import auth from './module/auth/auth'

// public - 공용
import partitionLog from './module/public/partitionLog'

// schedule - 스케줄
import schedule from './module/schedule/schedule'
import reserveSchedule from './module/schedule/reserveSchedule'

// public - 공용
import gym from './module/public/gym'
import setting from './module/public/setting'
import managerLayout from './module/public/managerLayout'

// member - 회원 관리
import member from './module/member/member'
import ticket from './module/member/ticket'
import delayTicket from './module/member/delayTicket'
import memberAccess from './module/member/memberAccess'

// staff - 강사 관리
import staff from './module/staff/staff'

// option - 옵션 관리
import lockerSettings from './module/option/lockerSettings'

// operation - 운영 관리
import operationNotice from './module/operation/operationNotice'

// sales - 매출 관리
import salesState from './module/sales/salesState'
import salesDetail from './module/sales/salesDetail'

// settings - 환경설정
import defineDatas from './module/settings/defineDatas'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      common,
      managerLayout,
      auth,
      gym,
      inquiry,
      userSettings,
      community,
      defineDatas,
      schedule,
      member,
      staff,
      ticket,
      setting,
      reserveSchedule,
      delayTicket,
      memberAccess,
      partitionLog,
      operationNotice,
      salesState,
      salesDetail,
      lockerSettings
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEV
    strict: false
  })

  return Store
}
