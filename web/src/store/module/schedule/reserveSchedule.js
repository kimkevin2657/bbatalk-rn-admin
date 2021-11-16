import {
  GET_ALL_RESERVESCHEDULE,
  GET_RESERVESCHEDULE,
  CREATE_RESERVESCHEDULE,
  UPDATE_RESERVESCHEDULE,
  DELETE_RESERVESCHEDULE,
  DELETE_BULK_RESERVESCHEDULE
} from 'src/store/gql/schedule/reserveScheduleGQL'

const initReserveScheduleData = () => {
  return {
    gymid: void 0,          // 센터 id
    scheduleid: void 0,     // 스케줄 id
    ticketid: void 0,       // 수강권 id
    memberid: void 0,       // 회원 id
    staffid: void 0,        // 강사 id
    // 회원 정보
    mName: '',              // 회원명
    mSpecial_n: void 0,     // 회원 고유번호
    mPhoto: void 0,         // 회원 사진
    mGender: void 0,        // 성별
    // 강사 정보
    sName: '',              // 강사명
    sSpecial_n: void 0,     // 강사 고유번호
    sPhoto: void 0,         // 강사 사진
    // 수강 정보
    tName: '',              // 수강명
    totCnt: 0,              // 총 횟수
    useCnt: 0,              // 사용 횟수
    sdate: void 0,          // 유효 시작일
    edate: void 0,          // 유효 종료일
    // 예약 정보
    date: void 0,           // 수업일
    stime: void 0,          // 수업시작시간
    etime: void 0,          // 수업종료시간
    duration: 0,            // 수업시작부터 종료까지의 Minutes
    isAgree: false,         // 예약 승인 상태
    state: 1,               // 출석 상태 (0: 결석, 1: 예약, 2: 출석, 3: 취소)
    register: '관리자',       // 등록자(관리자, 강사, 회원 중)
    desc: '',               // 설명 (결석 사유)
    regDate: void 0,        // 예약일시
    create_d: void 0        // 생성일
  }
}

const state = {
  reserveScheduleData: initReserveScheduleData(),
  reserveScheduleDataList: []
}

const mutations = {
  initReserveScheduleData (state) {
    state.reserveScheduleData = initReserveScheduleData()
  },
  initReserveScheduleDataList (state) {
    state.reserveScheduleDataList = []
  },
  setReserveScheduleDataList (state, payload) {
    state.reserveScheduleDataList = payload
  },
  setReserveScheduleData (state, payload) {
    state.reserveScheduleData = payload
  },
  addReserveScheduleData (state, payload) {
    let tempDataList = _.cloneDeep(state.reserveScheduleDataList)
    tempDataList.push(payload)
    state.reserveScheduleDataList = Object.freeze(tempDataList)
  },
  deleteReserveScheduleData (state, payload) {
    const tempDataList = _.cloneDeep(state.reserveScheduleDataList)
    if (_.has(payload, 'ids')) {
      const ids = payload.ids
      for (let i = 0, l = ids.length; i < l; i++) {
        const _id = ids[i]
        const scheduleIndex = _.findIndex(tempDataList, o => {
          return o._id === _id
        })
        if (payload === -1) continue
        tempDataList.splice(scheduleIndex, 1)
      }
    } else {
      const _id = payload._id
      const scheduleIndex = _.findIndex(tempDataList, o => {
        return o._id === _id
      })
      if (payload === -1) return
      tempDataList.splice(scheduleIndex, 1)
    }
    state.reserveScheduleDataList = Object.freeze(tempDataList)
  },
  updateReserveScheduleData (state, payload) {
    const tempDataList = _.cloneDeep(state.reserveScheduleDataList)
    let row = _.forEach(tempDataList, (o, index) => {
      if (o._id === payload._id) {
        tempDataList[index] = payload
      }
    })
    if (!row) return
    state.reserveScheduleDataList = Object.freeze(tempDataList)
  }
}

const actions = {
  // 예약 스케줄 목록 가져오기
  async reqGetReserveScheduleDataList ({ commit, rootState }, args) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_RESERVESCHEDULE,
        variables: args
      })
      commit('setReserveScheduleDataList', data.allReserveSchedule)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 상세 예약 스케줄 정보 가져오기
  async reqGetReserveScheduleData ({ commit }, { _id }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_RESERVESCHEDULE,
        variables: { _id }
      })
      commit('setReserveScheduleDataList', data.findReserveSchedule)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 예약 스케줄 추가
  async reqAddReserveScheduleData ({ state, commit, rootState }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    let row = _.cloneDeep(state.reserveScheduleData)
    row.gymid = gymid
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_RESERVESCHEDULE,
        variables: { input: row }
      })
      commit('addReserveScheduleData', data.createReserveSchedule)
      return { code: 'ok', result: data.createReserveSchedule }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 예약 스케줄 제거
  async reqRemoveReserveScheduleData ({ commit }, { _id = '', ids = void 0 }) {
    if (_.isArray(ids)) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_BULK_RESERVESCHEDULE,
          variables: { idList: ids }
        })
        commit('deleteReserveScheduleData', { ids })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    } else {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_RESERVESCHEDULE,
          variables: { _id }
        })
        commit('deleteReserveScheduleData', { _id: data.deleteMember._id })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    }
  },
  // 예약 스케줄 편집
  async reqUpdateReserveScheduleData ({ state, commit }, { row = void 0 } = {}) {
    if (!_.has(row, ['_id'])) return { code: 'nok' }
    const _id = row._id
    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_RESERVESCHEDULE,
        variables: { _id, input: row }
      })
      commit('updateReserveScheduleData', data.updateReserveSchedule)
      return { code: 'ok', result: data.updateReserveSchedule }
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
