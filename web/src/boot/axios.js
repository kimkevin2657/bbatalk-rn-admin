import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// import _ from 'lodash'

// if (process.env.DEV) {
//   axios.defaults.baseURL = 'http://localhost:3000'
// }

axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  const msg = error.response.data || error.toString()
  return Promise.reject({ code: 'err', msg: msg })
})

axios.interceptors.response.use(function (response) {
  return Promise.resolve(response.data)
}, function (error) {
  if (error.response && error.response.status === 401) {
    window.location.href = '/'
    return
  }
  const msg = error.response.data || error.toString()
  return Promise.reject({ code: 'err', msg: msg })
})

Vue.prototype.$axios = axios
Vuex.Store.prototype.$axios = axios
