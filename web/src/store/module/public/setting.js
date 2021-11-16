import { GET_CARD, GET_BANK } from '../../gql/public/settingGQL'

const state = {
  cardList: [],
  bankList: []
}

const mutations = {
  setCardList (state, payload) {
    state.cardList = payload
  },
  setBankList (state, payload) {
    state.bankList = payload
  }
}

const actions = {
  async reqGetCard ({ commit, rootState }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_CARD,
        fetchPolicy: 'cache-first' // 서버에 한번만 쿼리 후 캐쉬 데이터만 사용
      })
      commit('setCardList', _.get(data, ['findSetting', 'card']))
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqGetBank ({ commit, rootState }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_BANK,
        fetchPolicy: 'cache-first' // 서버에 한번만 쿼리 후 캐쉬 데이터만 사용
      })
      commit('setBankList', _.get(data, ['findSetting', 'bank']))
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
