import { GET_ALL_PARTIONLOG } from '../../gql/public/partitionLogGQL'

const state = {
  logYear: new Date().getFullYear(), // 년단위 로그(선택된 년도로 로그가 출력)
  logYearList: [] // 년단위 로그 리스트
}

const mutations = {
  setPartitionLogDataList (state, payload) {
    state.logYearList = payload
  },
  setLogYear (state, payload) {
    state.logYear = payload
  }
}

const actions = {
  // 년도별 정보 목록 가져오기
  async reqGetPartitionLogDataList ({ commit, rootState }, { type = void 0 } = {}) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_PARTIONLOG,
        variables: { type }
      })
      commit('setPartitionLogDataList', data.allPartitionLog)
      return { code: 'ok' }
    } catch {
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
