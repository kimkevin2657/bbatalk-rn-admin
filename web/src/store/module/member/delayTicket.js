import {
  GET_ALL_DELAY_TICKET, GET_DELAY_TICKET
} from 'src/store/gql/member/delayTicketGQL'
const initDelayTicketData = () => {
  return {
    _id: void 0,
    gymid: void 0,
    // 회원 정보
    memberid: void 0,
    name: '',
    engName: '',
    special_n: '',
    // 강사 정보
    staffid: '',
    staffName: '',
    staffEng: '',
    staffSpecial_n: '',
    // 티켓 정보
    ticketid: '',
    ticketName: '',
    // 연장 정보
    d_type: 'membership',
    before_sdate: void 0,  // 변경전
    before_edate: void 0,
    pause_sdate: void 0,   // 연장전
    pause_edate: void 0,
    after_sdate: void 0,   // 변경후
    after_edate: void 0,
    cause: '',
    reg_d: new Date()
  }
}

const state = {
  delayTicketData: initDelayTicketData(), // 기간연장 정보
  delayTicketDataList: [] // 기간연장 항목
}

const mutations = {
  initDelayTicketDataList (state) {
    state.delayTicketDataList = []
  },
  initDelayTicketData (state) {
    state.delayTicketData = initDelayTicketData()
  },
  setDelayTicketDataList (state, payload) {
    state.delayTicketDataList = Object.freeze(payload)
  },
  setDelayTicketData (state, payload) {
    state.delayTicketData = payload
  }
}

const actions = {
  // 기간연장 목록 가져오기
  async reqGetDelayTicketDataList ({ commit, rootState }, { memberid = void 0, ticketid = void 0 } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_DELAY_TICKET,
        variables: { gymid, ticketid, memberid }
      })
      commit('setDelayTicketDataList', data.allDelayTicket)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 상세 기간연장 정보 가져오기
  async reqGetDelayTicketData ({ commit }, { _id }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_DELAY_TICKET,
        variables: { _id }
      })
      commit('setDelayTicketData', data.findDelayTicket)
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
