/**
 * 회원관리용 상태관리 스토어
 */

const userData = {
  id: '',
  gym: {
    id: '',
    name: ''
  },
  special_n: '',
  name: {
    type: ''
  },
  gender: '',
  photo: void 0,
  birth: void 0,
  phone: '',
  email: '',
  address: '',
  job: '',
  cach_r: '',
  info: {
    sms: '',
    email: '',
    mgs: ''
  },
  memberType: '',
  membershipType: '',
  etc: '',
  consult_c: 0,
  visit_c: 0,
  locker: {
    id: '',
    name: ''
  },
  count_arr: [],
  create_t: ''
}

const state = {
  userDataList: [],
  userData: {}
}

const mutations = {
  initUserData (state) {
    state.userData = userData
  },
  initUserDataList (state) {
    state.userDataList = []
  },
  setUserDataList (state, payload) {
    if (!_.isArray(payload)) return
    state.userDataList = payload
  }
}

const actions = {
  async reqGetUserDataList ({ commit }, payload) {
    try {
      const { code, result } = await this.$axios.get('/api/user', payload)
      if (code === 'ok') {
        commit('setUserDataList', result)
      }
      return { code, result }
    } catch ({ code, msg }) {
      return { code, msg }
    }
  },
  async reqAddUser (payload) {
    try {
      const { code, result } = await this.$axios.post('/api/user', payload)
      return { code, result }
    } catch ({ code, msg }) {
      return { code, msg }
    }
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
