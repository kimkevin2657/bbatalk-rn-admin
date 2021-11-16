import { GET_ALL_INQUIRY, GET_SEARCH_INQUIRY, CREATE_INQUIRY, DELETE_BULK_INQUIRY, DELETE_INQUIRY, UPDATE_INQUIRY, GET_INQUIRY } from '../gql/inquiryGQL'
const initInquiryData = () => {
  return {
    _id: void 0,
    address: '',
    centerList: '',
    gym: '',
    gymid: void 0,
    surveyDate: '',
    name: '',
    gender: 'man',
    phone: '',
    membershipType: [], // 회원권
    lessonType: [], // 강습 권
    marketingPath: '',
    coupon: '',
    couponChk: '',
    visit: '',
    regChk: '', // 등록 여부
    survey: ''
  }
}

const state = {
  inquiryData: initInquiryData(), // 문의 정보
  inquiryDataList: [], // 문의 항목
  inquirySearchDataList: [] // 검색된 문의 항목
}

const mutations = {
  initInquiryData (state) {
    state.inquiryData = initInquiryData()
  },
  initInquiryDataList (state) {
    state.inquiryDataList = []
  },
  initInquirySearchDataList (state) {
    state.inquirySearchDataList = []
  },
  setInquiryDataList (state, payload) {
    state.inquiryDataList = Object.freeze(payload)
  },
  // 문의 회원검색 항목
  setInquirySearchDataList (state, payload) {
    state.inquirySearchDataList = Object.freeze(payload)
  },
  setInquiryData (state, payload) {
    state.inquiryData = payload
  },
  addInquiryData (state, payload) {
    let tempDataList = _.cloneDeep(state.inquiryDataList)
    tempDataList.push(payload)
    state.inquiryDataList = Object.freeze(tempDataList)
  },
  deleteInquiry (state, payload) {
    const tempDataList = _.cloneDeep(state.inquiryDataList)
    if (_.has(payload, 'ids')) {
      const ids = payload.ids
      for (let i = 0, l = ids.length; i < l; i++) {
        const _id = ids[i]
        const inquiryIndex = _.findIndex(tempDataList, o => {
          return o._id === _id
        })
        if (payload === -1) continue
        tempDataList.splice(inquiryIndex, 1)
      }
    } else {
      const _id = payload._id
      const inquiryIndex = _.findIndex(tempDataList, o => {
        return o._id === _id
      })
      if (payload === -1) return
      tempDataList.splice(inquiryIndex, 1)
    }
    state.inquiryDataList = Object.freeze(tempDataList)
  },
  updateInquiry (state, payload) {
    const tempDataList = _.cloneDeep(state.inquiryDataList)
    let row = _.forEach(tempDataList, (o, index) => {
      if (o._id === payload._id) {
        tempDataList[index] = payload
      }
    })
    if (!row) return
    state.inquiryDataList = Object.freeze(tempDataList)
  }
}

const actions = {
  // 문의 목록 가져오기
  async reqGetInquiryDataList ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_INQUIRY,
        variables: { gymid }
      })
      commit('setInquiryDataList', data.allInquiry)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 상세 문의 정보 가져오기
  async reqGetInquiryData ({ commit }, { _id }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_INQUIRY,
        variables: { _id }
      })
      commit('setInquiryData', data.findInquiry)
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqAddInquiry ({ state, commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    let row = _.cloneDeep(state.inquiryData)
    row.gymid = gymid
    delete row.family
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_INQUIRY,
        variables: { input: row }
      })
      commit('addInquiryData', data.createInquiry)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqRemoveInquiry ({ commit }, { _id = '', ids = void 0 }) {
    if (_.isArray(ids)) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_BULK_INQUIRY,
          variables: { idList: ids }
        })
        commit('deleteInquiry', { ids })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    } else {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_INQUIRY,
          variables: { _id }
        })
        commit('deleteInquiry', { _id: data.deleteInquiry._id })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    }
  },
  async reqUpdateInquiry ({ state, commit }) {
    const _id = state.inquiryData._id
    let row = _.cloneDeep(state.inquiryData)
    delete row._id
    delete row.__typename
    delete row.family
    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_INQUIRY,
        variables: { _id, input: row }
      })
      commit('updateInquiry', data.updateInquiry)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 회원검색 목록 가져오기
  async reqInquirySearchDataList ({ rootState, commit }, { name = '' } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_SEARCH_INQUIRY,
        variables: { gymid, name }
      })
      commit('setInquirySearchDataList', data.allInquiry)
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
