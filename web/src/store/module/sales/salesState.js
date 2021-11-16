import {
  GET_SALES_STATS,
  GET_MEMBERSHIP_TYPE_WIDGET,
  GET_MEMBERSHIP_TICKET_WIDGET,
  GET_LESSON_TEAM_WIDGET,
  GET_LESSON_TICKET_WIDGET,
  GET_MEMBER_TOP_TEN_WIDGET,
  GET_STAFF_TOP_TEN_WIDGET
} from '../../gql/sales/salesStateGQL'

// 통계 쿼리 날짜 초기화
function initStateData () {
  const t = new Date()
  const month = (t.getMonth() + 1) < 10 ? `0${t.getMonth() + 1}` : t.getMonth() + 1
  const date = t.getDate() < 10 ? `0${t.getDate()}` : t.getDate()
  const tStr = `${t.getFullYear()}-${month}-${date}`
  return {
    from: tStr,
    to: tStr
  }
}
// 매출 통계 초기화
function initSalesStatsData () {
  return {
    membership: {
      sales: 0,
      cnt: 0,
      refund: 0,
      rcnt: 0
    },
    lesson: {
      sales: 0,
      cnt: 0,
      refund: 0,
      rcnt: 0
    },
    option: {
      sales: 0,
      cnt: 0,
      refund: 0,
      rcnt: 0
    },
    total: {
      sales: 0,
      cnt: 0,
      refund: 0,
      rcnt: 0
    }
  }
}

// 카테고리 형식 데이터 초기화
function initCategoryTypeData () {
  return {
    type: '',
    category: [],
    series: []
  }
}

const state = {
  stateData: initStateData(),
  salesStatsData: initSalesStatsData(),
  membershipTypeData: initCategoryTypeData(),
  membershipTicketData: initCategoryTypeData(),
  lessonTeamData: initCategoryTypeData(),
  lessonTicketData: initCategoryTypeData(),
  memberTopTenDataList: [],
  staffTopTenDataList: []
}

const mutations = {
  initStateData (state) {
    state.stateData = initStateData()
    state.salesStatsData = initSalesStatsData()
    state.membershipTypeData = initCategoryTypeData()
    state.membershipTicketData = initCategoryTypeData()
    state.lessonTeamData = initCategoryTypeData()
    state.lessonTicketData = initCategoryTypeData()
    state.memberTopTenDataList = []
    state.staffTopTenDataList = []
  },
  setStateData (state, payload) {
    state.stateData = _.assign(state.stateData, payload)
  },
  setSalesStatsData (state, payload) {
    state.salesStatsData = Object.freeze(payload)
  },
  setMembershipTypeData (state, payload) {
    state.membershipTypeData = Object.freeze(payload)
  },
  setMembershipTicketData (state, payload) {
    state.membershipTicketData = Object.freeze(payload)
  },
  setLessonTeamData (state, payload) {
    state.lessonTeamData = Object.freeze(payload)
  },
  setLessonTicketData (state, payload) {
    state.lessonTicketData = Object.freeze(payload)
  },
  setMemberTopTenDataList (state, payload) {
    if (!_.isArray(payload)) return
    state.memberTopTenDataList = Object.freeze(payload)
  },
  setStaffTopTenDataList (state, payload) {
    if (!_.isArray(payload)) return
    state.staffTopTenDataList = Object.freeze(payload)
  }
}

const actions = {
  // 매출 통계 요청
  async getSalesStats ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const from = `${state.stateData.from} 00:00:00`
      const to = `${state.stateData.to} 23:59:59`
      const { data } = await this.$apollo.query({
        query: GET_SALES_STATS,
        variables: { gymid, from, to }
      })
      commit('setSalesStatsData', data.searchSalesStats)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 회원유형 계약 건수 요청
  async getMembershipTypeWidget ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const from = `${state.stateData.from} 00:00:00`
      const to = `${state.stateData.to} 23:59:59`
      const { data } = await this.$apollo.query({
        query: GET_MEMBERSHIP_TYPE_WIDGET,
        variables: { gymid, from, to }
      })
      commit('setMembershipTypeData', data.searchMembershipType)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 회원권 유형별 계약 건수
  async getMembershipTicketWidget ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const from = `${state.stateData.from} 00:00:00`
      const to = `${state.stateData.to} 23:59:59`
      const { data } = await this.$apollo.query({
        query: GET_MEMBERSHIP_TICKET_WIDGET,
        variables: { gymid, from, to }
      })
      commit('setMembershipTicketData', data.searchMembershipTicket)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 수강팀 계약 건수
  async getLessonTeamWidget ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const from = `${state.stateData.from} 00:00:00`
      const to = `${state.stateData.to} 23:59:59`
      const { data } = await this.$apollo.query({
        query: GET_LESSON_TEAM_WIDGET,
        variables: { gymid, from, to }
      })
      commit('setLessonTeamData', data.searchLessonTeam)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 수강권 계약 건수
  async getLessonTicketWidget ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const from = `${state.stateData.from} 00:00:00`
      const to = `${state.stateData.to} 23:59:59`
      const { data } = await this.$apollo.query({
        query: GET_LESSON_TICKET_WIDGET,
        variables: { gymid, from, to }
      })
      commit('setLessonTicketData', data.searchLessonTicket)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 매출 상위 고객 Top10
  async getMemberTopTenWidget ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const from = `${state.stateData.from} 00:00:00`
      const to = `${state.stateData.to} 23:59:59`
      const { data } = await this.$apollo.query({
        query: GET_MEMBER_TOP_TEN_WIDGET,
        variables: { gymid, from, to }
      })
      commit('setMemberTopTenDataList', data.searchMemberTopTen)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 실적 상위 고객 Top10
  async getStaffTopTenWidget ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const from = `${state.stateData.from} 00:00:00`
      const to = `${state.stateData.to} 23:59:59`
      const { data } = await this.$apollo.query({
        query: GET_STAFF_TOP_TEN_WIDGET,
        variables: { gymid, from, to }
      })
      commit('setStaffTopTenDataList', data.searchStaffTopTen)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
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
