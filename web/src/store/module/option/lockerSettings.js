import {
  GET_ALL_GROUP_LOCKER,
  GET_GROUP_LOCKER,
  CREATE_GROUP_LOCKER,
  UPDATE_GROUP_LOCKER,
  DELETE_GROUP_LOCKER

} from 'src/store/gql/member/lockerGQL'
const initLockerGroupData = () => {
  return {
    _id: void 0,
    gymid: void 0,
    // 락커 그룹 정보
    name: '',
    desc: ''
  }
}

const state = {
  lockerGroupData: initLockerGroupData(), // 락커 그룹 정보
  lockerGroupDataList: [] // 락커 그룹 항목
}

const mutations = {
  initLokerGroupDataList (state) {
    state.lockerGroupDataList = []
  },
  initLokerGroupData (state) {
    state.lockerGroupData = initLockerGroupData()
  },
  setLokerGroupDataList (state, payload) {
    state.lockerGroupDataList = Object.freeze(payload)
  },
  setLokerGroupData (state, payload) {
    state.lockerGroupData = payload
  },
  addLockerGroupData (state, payload) {
    let tempDataList = _.cloneDeep(state.lockerGroupDataList)
    tempDataList.unshift(payload)
    state.lockerGroupDataList = Object.freeze(tempDataList)
  },
  deleteLockerGroupData (state, payload) {
    const tempDataList = _.cloneDeep(state.lockerGroupDataList)
    if (_.has(payload, 'ids')) {
      const ids = payload.ids
      for (let i = 0, l = ids.length; i < l; i++) {
        const _id = ids[i]
        const idx = _.findIndex(tempDataList, o => {
          return o._id === _id
        })
        if (idx === -1) continue
        tempDataList.splice(idx, 1)
      }
    } else {
      const _id = payload._id
      const idx = _.findIndex(tempDataList, o => {
        return o._id === _id
      })
      if (idx === -1) return
      tempDataList.splice(idx, 1)
    }
    state.lockerGroupDataList = Object.keys(tempDataList)
  },
  updateLockerGroupData (state, payload) {
    let tempDataList = _.cloneDeep(state.lockerGroupDataList)
    const _id = payload._id
    const idx = _.findIndex(tempDataList, o => {
      return o._id === _id
    })
    if (idx === -1) return
    tempDataList[idx] = payload
    state.lockerGroupDataList = Object.freeze(tempDataList)
  }
}

const actions = {
  // 락커 그룹 목록 가져오기
  async reqGetLockerGroupDataList ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_GROUP_LOCKER,
        variables: { gymid }
      })
      commit('setLokerGroupDataList', data.allLockerGroup)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 락커 그룹 상세 가져오기
  async reqGetLockerGroupData ({ commit }, { _id }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_GROUP_LOCKER,
        variables: { _id }
      })
      commit('setLokerGroupData', { payload: data.findLockerGroup })
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 락커 그룹 추가
  async reqAddLokcerGroupData ({ state, commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    let row = state.lockerGroupData
    row.gymid = gymid
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_GROUP_LOCKER,
        variables: { input: row, gymid }
      })
      commit('addLokerGroupData', { payload: data.createLockerGroup })
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 락커 그룹 제거
  async reqRemoveLockerGroupData ({ commit }, { _id = '', ids = void 0 }) {
    if (_.isArray(ids)) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_GROUP_LOCKER,
          variables: { idList: ids }
        })
        commit('deleteLockerGroupData', { ids })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    } else {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_GROUP_LOCKER,
          variables: { _id }
        })
        commit('deleteLockerGroupData', { _id: data.deleteLockerGroup })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    }
  },
  // 락커 그룹 수정
  async reqUpdateLockerGroupData ({ state, commit }) {
    const _id = state.lockerGroupData._id
    let row = _.cloneDeep(state.lockerGroupData)
    const deleteArr = ['_id']
    _.forEach(deleteArr, o => delete row[o])

    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_GROUP_LOCKER,
        variables: { _id, input: row }
      })
      commit('updateLockerGroupData', data.updateLockerGroupData)
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
