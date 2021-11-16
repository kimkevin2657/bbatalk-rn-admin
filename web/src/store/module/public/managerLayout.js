const state = {
  selectedMenu: '',
  leftDrawerOpen: false
}

const mutations = {
  setLeftDrawerOpen (state, payload) {
    state.leftDrawerOpen = payload
  }
}

const actions = {}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
