import Vue from 'vue'
import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'bottom',
  timeout: 1200
})
const notify = {
  install (Vue, options = {}) {
    const $notify = {
      info (message, icon = 'far fa-laugh-wink') {
        Notify.create({
          message,
          color: 'primary',
          icon
        })
      },
      warnning (message, icon = 'far fa-grin-beam-sweat') {
        Notify.create({
          message,
          color: 'orange-10',
          timeout: 2500,
          icon
        })
      },
      error (message, icon = 'far fa-sad-tear') {
        Notify.create({
          message,
          color: 'negative',
          timeout: 2500,
          icon
        })
      }
    }
    Vue.prototype.$notify = $notify
    window.$notify = $notify
  }
}
Vue.use(notify)
