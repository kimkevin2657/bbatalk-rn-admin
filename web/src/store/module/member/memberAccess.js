import {
  GET_ALL_MEMBER_ACCESS, GET_MEMBER_ACCESS, CREATE_MEMBER_ACCESS
} from 'src/store/gql/member/memberAccessGQL'

const initMemberAccessData = () => {
  return {
    _id: void 0,
    gymid: void 0,
    // 회원 정보
    memberid: void 0,
    name: '',
    engName: '',
    special_n: '',
    // 티켓 정보
    ticketid: '',
    ticketName: '',
    // 연장 정보
    type: 'membership'
  }
}

const state = {
  memberAccessData: initMemberAccessData(), // 기간연장 정보
  memberAccessDataList: [], // 기간연장 항목
  listCnt: 0
}

const mutations = {
  initMemberAccessDataList (state) {
    state.memberAccessDataList = []
    state.listCnt = 0
  },
  initMemberAccessData (state) {
    state.memberAccessData = initMemberAccessData()
  },
  setMemberAccessDataList (state, { totCnt, result }) {
    state.memberAccessDataList = Object.freeze(result)
    state.listCnt = totCnt
  },
  setMemberAccessData (state, payload) {
    state.memberAccessData = payload
  },
  addMemberAccessData (state, payload) {
    state.memberAccessDataList.push(payload)
  }
}

const actions = {
  // 출입 현황 목록 가져오기
  async reqGetMemberAccessDataList (
    { commit, rootState },
    {
      memberid = void 0,
      ticketid = void 0,
      page = void 0,
      offset = void 0,
      year = void 0
    } = {}
  ) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_MEMBER_ACCESS,
        variables: { gymid, ticketid, memberid, page, offset, year }
      })
      commit('setMemberAccessDataList', data.allMemberAccess)
      return { code: 'ok' }
    } catch (e) {
      commit('setMemberAccessDataList', [])
      return { code: 'nok' }
    }
  },
  // 출입하는 회원의 정보 가져오기
  async reqGetMemberAccessData ({ commit, rootState }, { _id = void 0, specialn = void 0 } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_MEMBER_ACCESS,
        variables: { _id, specialn, gymid }
      })
      commit('setMemberAccessData', data.findMemberAccess)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 출입하는 회원 로그 추가
  async reqAddMemberAccess ({ state, commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    const pickList = ['memberid', 'name', 'engName', 'special_n', 'ticketid', 'ticketName', 'type']
    let row = _.pick(_.cloneDeep(state.memberAccessData), pickList)
    row.gymid = gymid
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_MEMBER_ACCESS,
        variables: { input: row }
      })
      commit('addMemberAccessData', data.createMemberAccess)
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
