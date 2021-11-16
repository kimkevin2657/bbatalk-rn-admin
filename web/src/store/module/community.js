import { GET_ALL_TUBE, CREATE_TUBE, DELETE_TUBE } from '../gql/communityGQL'

const state = {
  tubeDataList: []
}

const mutations = {
  setTubeDataList (state, payload) {
    state.tubeDataList = Object.freeze(payload)
  },
  addTubeDataList (state, payload) {
    const tempDataList = _.cloneDeep(state.tubeDataList)
    tempDataList.unshift(payload)
    state.tubeDataList = Object.freeze(tempDataList)
  },
  delTubeDataList (state, tubeKey) {
    const tempDataList = _.cloneDeep(state.tubeDataList)
    const tubeIndex = _.findIndex(tempDataList, o => {
      return o.key === tubeKey
    })
    if (tubeIndex === -1) return
    tempDataList.splice(tubeIndex, 1)
    state.tubeDataList = Object.freeze(tempDataList)
  }
}

const actions = {
  /**
   * 유튜브 동영상 모든 영상을 가져온다
   */
  async reqGetAllTube ({ commit }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_TUBE
      })
      commit('setTubeDataList', data.allTube)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 유튜브 동영상 추가 요청
   */
  async reqAddTube ({ commit }, payload) {
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_TUBE,
        variables: { input: payload }
      })
      commit('addTubeDataList', data.createTube)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 유튜브 동영상 제거
   */
  async reqDelTube ({ commit }, { key }) {
    try {
      this.$apollo.mutate({
        mutation: DELETE_TUBE,
        variables: { key }
      })
      commit('delTubeDataList', key)
      return { code: 'ok' }
    } catch ({ code, msg }) {
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
