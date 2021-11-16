import { GET_ALL_GYM, GET_GYM, UPDATE_GYM } from '../../gql/public/gymGQL'

const initGymData = () => {
  return {
    _id: void 0,
    name: void 0,
    mid: void 0,
    stime: '06:00',
    etime: '23:00',
    memberRank: 0,
    transferPolicy: 0,
    transferPee: 50000,
    accessRange: 30,
    create_d: void 0
  }
}

const state = {
  gymDataList: [],
  gymData: initGymData()
}

const mutations = {
  initGymData (state) {
    state.gymData = initGymData()
  },
  setGymDataList (state, payload) {
    state.gymDataList = payload
  },
  setGymData (state, payload) {
    state.gymData = payload
  }
}

const actions = {
  /**
   * 모든 센터 정보 조회, 같은 관리자 계정에서 소유하고 있는 센터 정보 목록 가져오기
   */
  async reqGetGymDataList ({ commit, rootState }) {
    const memberId = _.get(rootState, ['auth', 'memberId'], void 0)
    if (!memberId) throw new Error('관리자 ID를 알 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_GYM,
        variables: { mid: memberId }
      })
      commit('setGymDataList', data.allGym)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 센터 정보를 조회
   */
  async reqGetGymData ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_GYM,
        variables: { _id: gymid }
      })
      commit('setGymData', data.findGym)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 센터 정보를 변경
   */
  async reqUpdateGym ({ commit, rootState, state }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    let row = _.cloneDeep(state.gymData)
    row = _.omit(row, ['_id', 'mid', 'create_d'])
    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_GYM,
        variables: { _id: gymid, input: row }
      })
      commit('setGymData', data.updateGym)
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
