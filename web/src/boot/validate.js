/** Validate 플러그인
 *
 * Vee-validate 모듈을 사용하여 입력값에 대한 유효성 검사를 수행함
 * 유효성 검사 메시지는 validateDic 에서 수정해야함.
 * 가이드라인: http://vee-validate.logaretm.com/v2/guide/
 */

import Vue from 'vue'
import VeeValidate from 'vee-validate'
import { dictionary } from '../resources/validateDic'
import moment from 'moment'
const validator = VeeValidate.Validator

// 영문,숫자,_만 입력 가능(4~20자)
validator.extend('id', {
  validate: value => {
    return /^[a-z0-9_]{4,20}$/g.test(value)
  }
})

// 영문,숫자,특수기호를 포함한 비밀번호(8~32자)
validator.extend('password', {
  validate: value => {
    return /^.*(?=^.{8,32}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[*!@#$%^&+=]).*$/.test(value)
  }
})

validator.extend('pwdcheck', {
  validate: (value, arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return false
    return value === arr[0]
  }
})

// 핸드폰 번호 확인
validator.extend('phone', {
  validate: value => {
    return /^\d{2,3}-\d{3,4}-\d{3,4}$/.test(value)
  }
})

// 12:00 시간 형식
validator.extend('time', {
  validate: value => {
    return /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/.test(value)
  }
})

validator.extend('date', {
  validate: value => {
    return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(value)
  }
})

// 범위 안의 일정(day)인지 확인
// value: YYYY-MM-DD 형식
validator.extend('range_date', {
  validate: (value, { before, after }) => {
    return moment(value).isBetween(before, after, null, '[]')
  }
}, { paramNames: ['before', 'after'] })

// Validate Config 설정
const validateConfig = {
  locale: 'ko',
  inject: false,
  dictionary
}

// Vee-validate를 사용할 Vue 컴포넌트에만 적용
Vue.use(VeeValidate, validateConfig)
