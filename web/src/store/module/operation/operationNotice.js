import {
  GET_ALL_OPERATION_NOTICE,
  GET_OPERATION_NOTICE,
  CREATE_OPERATION_NOTICE,
  UPDATE_OPERATION_NOTICE,
  DELETE_OPERATION_NOTICE,
  CHECK_OPERATION_NOTICE
} from 'src/store/gql/operation/operationNoticeGQL'

const initOperationNoticeData = () => {
  return {
    num: -1,
    name: '', // 작성자
    title: '', // 게시물 제목
    content: '', // 게시물 내용
    pwd: void 0,  // pwd
    comments: [], // 댓글
    see: 0, // 조회수
    create_d: void 0 // 생성일
  }
}

const state = {
  operationNoticeData: initOperationNoticeData(),
  operationNoticeDataList: []
}

const mutations = {
  initOperationNoticeData (state) {
    state.operationNoticeData = initOperationNoticeData()
  },
  initOperationNoticeDataList (state) {
    state.operationNoticeDataList = []
  },
  setOperationNoticeDataList (state, payload) {
    state.operationNoticeDataList = payload
  },
  setOperationNoticeData (state, payload) {
    state.operationNoticeData = payload
  },
  setOperationNoticeDataPwd (state, payload) {
    state.operationNoticeData.pwd = payload
  },
  addOperationNoticeData (state, payload) {
    let tempDataList = _.cloneDeep(state.operationNoticeDataList)
    tempDataList.push(payload)
    state.operationNoticeDataList = Object.freeze(tempDataList)
  },
  deleteOperationNoticeData (state, payload) {
    const tempDataList = _.cloneDeep(state.operationNoticeDataList)
    const _id = payload._id
    const idx = _.findIndex(tempDataList, o => {
      return o._id === _id
    })
    if (payload === -1) return
    tempDataList.splice(idx, 1)
    state.operationNoticeDataList = Object.freeze(tempDataList)
  },
  updateOperationNoticeData (state, payload) {
    const tempDataList = _.cloneDeep(state.operationNoticeDataList)
    let row = _.forEach(tempDataList, (o, index) => {
      if (o._id === payload._id) {
        tempDataList[index] = payload
      }
    })
    if (!row) return
    state.operationNoticeDataList = Object.freeze(tempDataList)
  }
}

const actions = {
  // 게시글 목록 가져오기
  async reqGetOperationNoticeDataList ({ commit, rootState }, args) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_OPERATION_NOTICE,
        variables: args
      })
      commit('setOperationNoticeDataList', data.allOperationNotice)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 상세 게시글 정보 가져오기
  async reqGetOperationNoticeData ({ commit, rootState }, { num }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_OPERATION_NOTICE,
        variables: { num, gymid }
      })
      commit('setOperationNoticeData', data.findOperationNotice)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 게시글 비밀번호 확인
  async reqCheckOperationNoticePwd (args, { _id, pwd }) {
    try {
      const { data } = await this.$apollo.query({
        query: CHECK_OPERATION_NOTICE,
        variables: { _id, pwd }
      })
      if (data.checkOperationNoticePwd) {
        return { code: 'ok' }
      } else {
        return { code: 'nok' }
      }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 게시글 추가
  async reqAddOperationNoticeData ({ state, commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    let row = _.cloneDeep(state.operationNoticeData)
    row = _.omit(row, ['comments', 'see', 'num'])
    row.gymid = gymid
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_OPERATION_NOTICE,
        variables: { input: row }
      })
      commit('addOperationNoticeData', data.createOperationNotice)
      return { code: 'ok', result: data.createOperationNotice }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 게시글 편집
  async reqUpdateOperationNoticeData ({ state, commit }) {
    let row = _.cloneDeep(state.operationNoticeData)
    if (!_.has(row, ['_id'])) return { code: 'nok' }
    const _id = row._id
    row = _.omit(row, ['_id', 'comments', 'see', 'num', 'create_d'])
    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_OPERATION_NOTICE,
        variables: { _id, input: row }
      })
      commit('updateOperationNoticeData', data.updateOperationNotice)
      return { code: 'ok', result: data.updateOperationNotice }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 게시글 제거
  async reqRemoveOperationNoticeData ({ commit }, { _id = '', pwd = '' }) {
    try {
      const { data } = await this.$apollo.mutate({
        mutation: DELETE_OPERATION_NOTICE,
        variables: { _id, pwd }
      })
      commit('deleteOperationNoticeData', { _id: data.deleteOperationNotice._id })
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
