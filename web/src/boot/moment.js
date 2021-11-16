import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.prototype.$moment = moment
Vuex.Store.prototype.$moment = moment
window.$moment = moment
