import {
  GET_ALL_MEMBER,
  GET_SEARCH_MEMBER,
  CREATE_MEMBER,
  DELETE_BULK_MEMBER,
  DELETE_MEMBER,
  UPDATE_MEMBER,
  GET_MEMBER
} from 'src/store/gql/member/memberGQL'
const initMemberData = () => {
  return {
    _id: void 0,
    gymid: void 0,
    special_n: '',
    photo: void 0,
    name: '',
    engName: '',
    gender: 'man',
    ranking: '',
    phone: '',
    email: '',
    regDate: new Date(), // 등록일자
    regType: '신규', // 등록구분 (신규, 재등록(2회), 양도, 환불, 만기)
    birth: '', // 생년월일(YYYY-MM-DD)
    address_f: '', // 앞자리 주소
    address_l: '', // 상세 주소
    memberType: '', // 회원 구분
    memberRank: '', // 회원 등급
    // memberGroup: [], // 회원 분류(일반, 보증금, 입주민, 법인, 단체, 가족, 지원) 복수로 들어감
    // membership: [], // 회원권  {name, month, sdate, edate, price} // 회원권 개월 // 회원권 기간 // 회원 등록 경로 }
    // lesson: [], // 강습 권 // 강습명 {name, peopleCnt, number, month, teacher, sdate, edate, price}
    point: 0, // 포인트
    familys: [],
    familyids: [], // 가족 계정, family 정보를 가져올 수 있음.

    organization: '', // 단체 소속
    recommender: void 0, // 소개자
    recommenderid: '', // 소개자 id
    carNumber_f: '', // 차량 번호 앞자리
    carNumber_l: '', // 차량 번호 뒷자리
    regMemo: '' // 등록 메모
  }
}

const state = {
  memberData: initMemberData(), // 회원 정보
  memberDataList: [], // 회원 항목
  memberSearchDataList: [], // 검색된 회원 항목

  genSpecialNumber: ''
}

const mutations = {
  initMemberData (state) {
    state.memberData = initMemberData()
  },
  initMemberDataList (state) {
    state.memberDataList = []
  },
  initMemberSearchDataList (state) {
    state.memberSearchDataList = []
  },
  setMemberDataList (state, payload) {
    state.memberDataList = Object.freeze(payload)
  },
  // 회원검색 항목
  setMemberSearchDataList (state, payload) {
    state.memberSearchDataList = Object.freeze(payload)
  },
  setMemberData (state, payload) {
    state.memberData = payload
  },
  addMemberData (state, payload) {
    let tempDataList = _.cloneDeep(state.memberDataList)
    tempDataList.push(payload)
    state.memberDataList = Object.freeze(tempDataList)
  },
  deleteMember (state, payload) {
    const tempDataList = _.cloneDeep(state.memberDataList)
    if (_.has(payload, 'ids')) {
      const ids = payload.ids
      for (let i = 0, l = ids.length; i < l; i++) {
        const _id = ids[i]
        const memberIndex = _.findIndex(tempDataList, o => {
          return o._id === _id
        })
        if (payload === -1) continue
        tempDataList.splice(memberIndex, 1)
      }
    } else {
      const _id = payload._id
      const memberIndex = _.findIndex(tempDataList, o => {
        return o._id === _id
      })
      if (payload === -1) return
      tempDataList.splice(memberIndex, 1)
    }
    state.memberDataList = Object.freeze(tempDataList)
  },
  updateMember (state, payload) {
    const tempDataList = _.cloneDeep(state.memberDataList)
    let row = _.forEach(tempDataList, (o, index) => {
      if (o._id === payload._id) {
        tempDataList[index] = payload
      }
    })
    if (!row) return
    state.memberDataList = Object.freeze(tempDataList)
  },
  updateSpecialNumber (state, payload) {
    state.genSpecialNumber = payload
  }
}

const actions = {
  // 회원 목록 가져오기
  async reqGetMemberDataList ({ commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_MEMBER,
        variables: { gymid }
      })
      commit('setMemberDataList', data.allMember)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 상세 회원 정보 가져오기
  async reqGetMemberData ({ commit }, { _id }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_MEMBER,
        variables: { _id }
      })
      commit('setMemberData', data.findMember)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqAddMember ({ state, commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    let row = _.cloneDeep(state.memberData)
    row.gymid = gymid
    const deleteArr = ['familys', 'rankInfo', 'recommender', 'purchase']
    _.forEach(deleteArr, o => delete row[o])
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_MEMBER,
        variables: { input: row }
      })
      commit('addMemberData', data.createMember)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqRemoveMember ({ commit }, { _id = '', ids = void 0 }) {
    if (_.isArray(ids)) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_BULK_MEMBER,
          variables: { idList: ids }
        })
        commit('deleteMember', { ids })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    } else {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_MEMBER,
          variables: { _id }
        })
        commit('deleteMember', { _id: data.deleteMember._id })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    }
  },
  async reqUpdateMember ({ state, commit }) {
    const _id = state.memberData._id
    let row = _.cloneDeep(state.memberData)
    const deleteArr = ['_id', 'familys', 'rankInfo', 'recommender', 'purchase']
    _.forEach(deleteArr, o => delete row[o])

    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_MEMBER,
        variables: { _id, input: row }
      })
      commit('updateMember', data.updateMember)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqSpecialNumber ({ commit }, query) {
    try {
      const { code, result } = await this.$axios.get('/api/member/special', { params: query })
      if (code === 'ok') {
        commit('updateSpecialNumber', result)
      }
      return { code, result }
    } catch ({ code, msg }) {
      return { code, msg }
    }
  },
  // 회원검색 목록 가져오기
  async reqMemberSearchDataList ({ rootState, commit }, { name = '' } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_SEARCH_MEMBER,
        variables: { gymid, name }
      })
      commit('setMemberSearchDataList', data.allMember)
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
