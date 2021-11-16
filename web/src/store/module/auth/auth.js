const state = {
  email: '', // 인증 이메일
  memberId: '', // 계정 ID
  memberType: '', // 회원 유형 (관리자: manager, 강사: teacher, 고객: user)
  memberData: {}, // 계정 정보
  gymInfo: {}
}

const mutations = {
  setEmail (state, payload) {
    state.email = payload
  },
  setMemberType (state, payload) {
    state.memberType = payload
  },
  setMemberId (state, payload) {
    state.memberId = payload
  },
  setMemberData (state, payload) {
    state.memberData = Object.freeze(payload)
  },
  setGymInfo (state, payload) {
    state.gymInfo = payload
  }
}

const actions = {
  async reqLogin ({ commit }, payload) {
    try {
      const { code, result } = await this.$axios.post('/api/auth/login', payload)
      if (code === 'ok') {
        if (_.has(result, 'type')) commit('setMemberType', result.type)
        if (_.has(result, 'id')) commit('setMemberId', result.id)
        if (_.has(result, 'member')) commit('setMemberData', result.member)
        if (_.has(result, 'gym')) commit('setGymInfo', result.gym)
      }
      if (process.env.DEV) {
        localStorage.setItem('authType', result.type)
        localStorage.setItem('authId', result.id)
        localStorage.setItem('authGym', JSON.stringify(result.gym))
      }
      return { code, result }
    } catch ({ code, msg }) {
      return { code, msg }
    }
  },
  async reqAuthEmail ({ commit }, payload) {
    try {
      const { code, result } = await this.$axios.post('/api/auth/sendemail', payload)
      if (code === 'ok') {
        commit('setEmail', payload.email)
      }
      return { code, result }
    } catch ({ code, msg }) {
      return { code, msg }
    }
  },
  async reqAuthKey ({ state }, payload) {
    try {
      const { code, result } = await this.$axios.get('/api/auth/authkey', { params: payload })
      return { code, result }
    } catch ({ code, msg }) {
      return { code, msg }
    }
  },
  async reqIdCheck ({ state }, payload) {
    try {
      const { code, result } = await this.$axios.get('/api/auth/checkid', { params: payload })
      return { code, result }
    } catch ({ code, msg }) {
      return { code, msg }
    }
  },
  /**
   * 회원 가입
   */
  async reqRegsterMember ({ commit }, payload) {
    try {
      const { code, result } = await this.$axios.post('/api/auth/member', payload)
      return { code, result }
    } catch ({ code, msg }) {
      return { code, msg }
    }
  },
  /**
   * 쿠키 정보 가져오기
   */
  async reqCheck ({ commit }, payload) {
    if (process.env.DEV) {
      let res = {}
      res.type = localStorage.getItem('authType')
      res.id = localStorage.getItem('authId')
      res.gym = localStorage.getItem('authGym')
      if (_.has(res, 'type')) commit('setMemberType', res.type)
      if (_.has(res, 'member')) commit('setMemberData', res.member)
      if (_.has(res, 'id')) commit('setMemberId', res.id)
      if (_.has(res, 'gym')) commit('setGymInfo', JSON.parse(res.gym))
      return { code: 'ok', result: res }
    }
    try {
      const { code, result } = await this.$axios.get('/api/auth/check')
      if (code === 'ok') {
        if (_.has(result, 'type')) commit('setMemberType', result.type)
        if (_.has(result, 'member')) commit('setMemberData', result.member)
        if (_.has(result, 'gym')) commit('setGymInfo', result.gym)
        if (_.has(result, 'id')) commit('setMemberId', result.id)
      }
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
