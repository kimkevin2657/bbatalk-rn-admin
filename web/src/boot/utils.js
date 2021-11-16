/**
 * Vue에 삽입해서 사용하기 쉽게 만들어 주는 유틸 모음
 */

import Vue from 'vue'

// Sleep 함수 주입
Vue.use({
  install (Vue, options = {}) {
    if (this.installed) return
    Vue.prototype.$util = {}
    // 강제 대기
    Vue.prototype.$sleep = function (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    // 부가세
    Vue.prototype.$vat = function (supplyCost) {
      return Number((supplyCost / 11).toFixed(0))
    }

    // 1000단위 콤마
    Vue.prototype.$util.comma = function (val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
})
