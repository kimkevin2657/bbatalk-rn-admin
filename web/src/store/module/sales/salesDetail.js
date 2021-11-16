import { GET_MEMBERSHIP_SALES, GET_LESSON_SALES } from '../../gql/sales/salesDetailGQL'
import { GET_PAGE_TICKET } from '../../gql/member/ticketGQL'
const initStateData = () => {
  const t = new Date()
  const month = (t.getMonth() + 1) < 10 ? `0${t.getMonth() + 1}` : t.getMonth() + 1
  const date = t.getDate() < 10 ? `0${t.getDate()}` : t.getDate()
  const tStr = `${t.getFullYear()}-${month}-${date}`
  return {
    from: tStr,
    to: tStr,
    page: void 0,
    offset: void 0
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
  stateData: initStateData(), // 기간 데이터 (검색용)
  membershipSalesData: initCategoryTypeData(), // 회원권 차트 데이터
  lessonSalesData: initCategoryTypeData(), // 수강권 차트 데이터
  membershipDataList: [], // 회원권 목록(pagenation)
  lessonDataList: [], // 수강권 목록(pagenation)
  listCnt: 0
}

const mutations = {
  initStateData (state) {
    state.stateData = initStateData()
    state.membershipSalesData = initCategoryTypeData()
    state.lessonSalesData = initCategoryTypeData()
    state.membershipDataList = []
    state.lessonDataList = []
    state.listCnt = 0
  },
  setStateData (state, payload) {
    state.stateData = _.assign(state.stateData, payload)
  },
  setMembershipSalesData (state, payload) {
    state.membershipSalesData = Object.freeze(payload)
  },
  setMembershipData (state, { totCnt, result }) {
    state.membershipDataList = Object.freeze(result)
    state.listCnt = totCnt
  },
  setLessonSalesData (state, payload) {
    state.lessonSalesData = Object.freeze(payload)
  },
  setLessonData (state, { totCnt, result }) {
    state.lessonDataList = Object.freeze(result)
    state.listCnt = totCnt
  }
}

const actions = {
  // 회원권 매출 chart
  async reqGetSalesMember ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      let from, to
      if (/[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(state.stateData.from)) {
        from = state.stateData.from
        to = state.stateData.to
      } else {
        from = `${state.stateData.from} 00:00:00`
        to = `${state.stateData.to} 23:59:59`
      }
      const { data } = await this.$apollo.query({
        query: GET_MEMBERSHIP_SALES,
        variables: { gymid, from, to }
      })
      commit('setMembershipSalesData', data.searchMembershipSales)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 회원권 매출 table
  async reqGetMembershipData ({ commit, rootState }, { page = 1, offset = 20 } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      let from, to
      if (/[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(state.stateData.from)) {
        from = state.stateData.from
        to = state.stateData.to
      } else {
        from = `${state.stateData.from} 00:00:00`
        to = `${state.stateData.to} 23:59:59`
      }
      const { data } = await this.$apollo.query({
        query: GET_PAGE_TICKET,
        variables: { gymid, type: 'membership', from, to, page, offset }
      })
      commit('setMembershipData', data.pageSalesTicket)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 수강권 매출 chart
  async reqGetSalesLesson ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      let from, to
      if (/[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(state.stateData.from)) {
        from = state.stateData.from
        to = state.stateData.to
      } else {
        from = `${state.stateData.from} 00:00:00`
        to = `${state.stateData.to} 23:59:59`
      }
      const { data } = await this.$apollo.query({
        query: GET_LESSON_SALES,
        variables: { gymid, from, to }
      })
      commit('setLessonSalesData', data.searchLessonSales)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 회원권 매출 table
  async reqGetLessonData ({ commit, rootState }, { page = 1, offset = 20 } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      let from, to
      if (/[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(state.stateData.from)) {
        from = state.stateData.from
        to = state.stateData.to
      } else {
        from = `${state.stateData.from} 00:00:00`
        to = `${state.stateData.to} 23:59:59`
      }
      const { data } = await this.$apollo.query({
        query: GET_PAGE_TICKET,
        variables: { gymid, type: 'lesson', from, to, page, offset }
      })
      commit('setLessonData', data.pageSalesTicket)
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
