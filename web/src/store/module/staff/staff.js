import {
  GET_ALL_STAFF,
  CREATE_STAFF,
  DELETE_BULK_STAFF,
  DELETE_STAFF,
  UPDATE_STAFF,
  GET_STAFF
} from 'src/store/gql/staff/staffGQL'
const initStaffData = () => {
  return {
    _id: void 0,
    gymid: void 0,
    special_n: '',
    photo: void 0,
    name: '',
    engName: '',
    gender: '',
    phone: '',
    email: '',
    regDate: new Date(),
    birth: '',
    address_f: '',
    address_l: '',
    isLeave: false,
    team: void 0,
    level: void 0,
    isOperation: false,
    seniorid: void 0,
    career: void 0,
    certificate: void 0,
    instarid: '',
    facebookid: '',
    youtubeid: '',
    blog: '',
    homepage: '',
    bank_n: '',
    account_n: '',
    account_h: '',
    memo: ''
  }
}
const state = {
  staffData: initStaffData(),
  staffDataList: []
}

const mutations = {
  initStaffData (state) {
    state.staffData = initStaffData()
  },
  setStaffDataList (state, payload) {
    state.staffDataList = payload
  },
  setStaffData (state, payload) {
    state.staffData = payload
  },
  addStaffData (state, payload) {
    const tempDataList = _.cloneDeep(state.staffDataList)
    tempDataList.push(payload)
    state.staffDataList = tempDataList
  },
  deleteStaff (state, payload) {
    const tempDataList = _.cloneDeep(state.staffDataList)
    if (_.has(payload, 'ids')) {
      const ids = payload.ids
      for (let i = 0, l = ids.length; i < l; i++) {
        const _id = ids[i]
        const staffIndex = _.findIndex(tempDataList, o => {
          return o._id === _id
        })
        if (payload === -1) return
        tempDataList.splice(staffIndex, 1)
      }
    } else {
      const _id = payload._id
      const staffIndex = _.findIndex(tempDataList, o => {
        return o._id === _id
      })
      tempDataList.splice(staffIndex, 1)
    }
    state.staffDataList = Object.freeze(tempDataList)
  },
  updateStaff (state, payload) {
    const tempDataList = _.cloneDeep(state.staffDataList)
    let row = _.forEach(tempDataList, (o, index) => {
      if (o._id === payload._id) {
        tempDataList[index] = payload
      }
    })
    if (!row) return
    state.staffDataList = tempDataList
  },
  updateSpecialNumber (state, payload) {
    state.genSpecialNumber = payload
  }
}

const actions = {
  // 강사 목록 가져오기
  async reqGetStaffDataList ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_STAFF,
        variables: { gymid }
      })
      commit('setStaffDataList', data.allStaff)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 상세 강사 정보 가져오기
  async reqGetStaffData ({ commit }, { _id }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_STAFF,
        variables: { _id }
      })
      commit('setStaffData', data.findStaff)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /*
  async reqAddStaff ({ commit }, row) {
    try {
      console.log('test:', row)
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_STAFF,
        variables: { input: row }
      })
      commit('addStaffData', data.createStaff)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  */
  async reqAddStaff ({ state, commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    let row = _.cloneDeep(state.staffData)
    row.gymid = gymid
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_STAFF,
        variables: { input: row }
      })
      commit('addStaffData', data.createStaff)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqRemoveStaff ({ commit }, { _id = '', ids = void 0 }) {
    if (ids) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_BULK_STAFF,
          variables: { idList: ids }
        })
        commit('deleteStaff', { ids })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    } else {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_STAFF,
          variables: { _id }
        })
        commit('deleteStaff', { payload: data.deleteStaff._id })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    }
  },
  async reqUpdateStaff ({ commit }) {
    const _id = state.staffData._id
    let row = _.cloneDeep(state.staffData)
    delete row._id
    delete row.__typename
    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_STAFF,
        variables: { _id: _id, input: row }
      })
      commit('updateStaff', data.updateStaff)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqSpecialNumber ({ commit }, query) {
    try {
      const { code, result } = await this.$axios.get('/api/staff/special', { params: query })
      if (code === 'ok') {
        commit('updateSpecialNumber', result)
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
