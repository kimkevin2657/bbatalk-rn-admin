import {
  GET_ALL_WORKTIME,
  GET_WORKTIME,
  CREATE_WORKTIME,
  UPDATE_WORKTIME,
  DELETE_WORKTIME
} from 'src/store/gql/schedule/worktimeGQL'

import {
  GET_ALL_SCHEDULE,
  GET_SCHEDULE,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE
} from 'src/store/gql/schedule/scheduleGQL'

// const initWorkTime = () => {
//   return {
//     teacher: void 0, // 강사
//     special_n: void 0, // 강사 고유번호
//     state: 'none',
//     date: void 0,
//     startTime: void 0,
//     endTime: void 0
//   }
// }

function initLessonScheduleData () {
  const date = new Date()
  const month = (date.getMonth() + 1) > 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  const dateStr = `${date.getFullYear()}-${month}-${date.getDate()}`
  return {
    _id: void 0,
    gymid: void 0,      // 센터id
    staffid: void 0,    // 강사id
    type: 'lesson',     // 스케줄 유형
    date: dateStr,       // 수업 일자 YYYY-MM-DD
    time: void 0,       // 시간 HH:mm
    stime: void 0,      // 수업 시작 시간
    etime: void 0,      // 수업 끝 시간
    duration: 60,       // 수업 시간
    sessionid: void 0,  // 수강권id
    session: void 0,    // 수강 조회용
    roomid: void 0,     // 룸id
    room: void 0,       // 룸 조회
    members: [],        // 회원 정보
    content: '',        // 메모
    create_d: void 0
  }
}

function initScheduleData () {
  const date = new Date()
  const month = (date.getMonth() + 1) > 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  const dateStr = `${date.getFullYear()}-${month}-${date.getDate()}`
  return {
    _id: void 0,
    gymid: void 0,
    staffid: void 0,
    type: 'schedule',
    date: dateStr,
    time: void 0,
    stime: void 0,
    etime: void 0,
    duration: 60,
    content: void 0,
    create_d: void 0
  }
}

const state = {
  workTimeDataList: [], // 일 단위 목록
  scheduleDataList: [],
  lessonScheduleData: initLessonScheduleData(), // 수강 스케쥴
  scheduleData: initScheduleData() // 스케줄
}
const mutations = {
  // =============================WorkTime
  initWorkTimeDataList (state) {
    state.workTimeDataList = []
  },
  setWorkTimeDataList (state, payload) {
    state.workTimeDataList = Object.freeze(payload)
  },
  saveWorkTimeData (state, payload) {
    let tempDataList = _.cloneDeep(state.workTimeDataList)
    tempDataList.push(payload)
    state.workTimeDataList = Object.freeze(tempDataList)
  },
  updateWorkTimeData (state, payload) {
    const tempDataList = _.cloneDeep(state.workTimeDataList)
    let row = _.forEach(tempDataList, (o, index) => {
      if (o._id === payload._id) {
        tempDataList[index] = payload
      }
    })
    if (!row) return
    state.workTimeDataList = Object.freeze(tempDataList)
  },
  deleteWorkTimeData (state, payload) {
    const tempDataList = _.cloneDeep(state.workTimeDataList)
    const workTimeIndex = _.findIndex(tempDataList, o => {
      return o._id === payload
    })
    if (workTimeIndex === -1) return
    tempDataList.splice(workTimeIndex, 1)
    state.workTimeDataList = Object.freeze(tempDataList)
  },
  // =============================Schedule
  initScheduleDataList (state) {
    state.scheduleDataList = []
  },
  initLessonScheduleData (state) {
    state.lessonScheduleData = initLessonScheduleData()
  },
  setScheduleDataList (state, payload) {
    state.scheduleDataList = Object.freeze(payload)
  },
  setScheduleData (state, { data, type }) {
    if (type === 'lesson') {
      state.lessonScheduleData = data
    } else {
      state.scheduleData = data
    }
  },
  saveScheduleData (state, payload) {
    let tempDataList = _.cloneDeep(state.scheduleDataList)
    tempDataList.push(payload)
    state.scheduleDataList = Object.freeze(tempDataList)
  },
  updateScheduleData (state, payload) {
    const tempDataList = _.cloneDeep(state.scheduleDataList)
    let row = _.forEach(tempDataList, (o, index) => {
      if (o._id === payload._id) {
        tempDataList[index] = payload
      }
    })
    if (!row) return
    state.scheduleDataList = Object.freeze(tempDataList)
  },
  deleteScheduleData (state, payload) {
    const tempDataList = _.cloneDeep(state.scheduleDataList)
    const scheduleIndex = _.findIndex(tempDataList, o => {
      return o._id === payload
    })
    if (scheduleIndex === -1) return
    tempDataList.splice(scheduleIndex, 1)
    state.scheduleDataList = Object.freeze(tempDataList)
  },
  // 스케줄 내의 Member를 추가
  addMemberScheduleData (state, payload) {
    const tempDataList = _.cloneDeep(state.scheduleDataList)
    const index = _.findIndex(tempDataList, o => o._id === payload.scheduleid)
    if (index === -1) return
    tempDataList[index].members.push(payload)
    state.scheduleDataList = Object.freeze(tempDataList)
  },
  // 스케줄 내의 Member를 수정
  updateMemberScheduleData (state, payload) {
    const tempDataList = _.cloneDeep(state.scheduleDataList)
    const schedule = _.find(tempDataList, o => o._id === payload.scheduleid)
    if (!schedule) return
    const memberIndex = _.findIndex(schedule.members, o => o._id === payload._id)
    schedule.members[memberIndex] = payload
    state.scheduleDataList = Object.freeze(tempDataList)
  }
}
const actions = {
  /** =============================WorkTime
   * 등록된 업무를 확인한다.
   */
  async reqGetWorkTime ({ commit }, { _id }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_WORKTIME,
        variables: { _id }
      })
      return { result: data.findWorkTime }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 모든 강사들의 업무 시간을 가져온다.
   * date: 해당 일자의 데이터만 가져오기
   * gymid: 센터 정보
   * staffid: 강사 정보
   */
  async reqGetWorkTimeDataList ({ commit }, { gymid, staffid, date }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_WORKTIME,
        variables: { gymid, date, staffid }
      })
      commit('setWorkTimeDataList', data.allWorkTime)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 강사의 업무 시간을 추가한다.
   */
  async reqAddWorkTime ({ commit }, payload) {
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_WORKTIME,
        variables: { input: payload }
      })
      commit('saveWorkTimeData', data.createWorkTime)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 강사의 업무 시간을 수정 한다.
   */
  async reqUpdateWorkTime ({ commit }, { query, row } = {}) {
    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_WORKTIME,
        variables: { _id: query._id, input: row }
      })
      commit('updateWorkTimeData', data.updateWorkTime)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 강사의 업무 시간을 제거 한다.
   */
  async reqRemoveWorkTime ({ commit }, { _id }) {
    try {
      await this.$apollo.mutate({
        mutation: DELETE_WORKTIME,
        variables: { _id }
      })
      commit('deleteWorkTimeData', _id)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /** =============================Schedule
   * 모든 스케줄을 가져온다.
   * payload.date: 해당 일자의 데이터만 가져오기
   * payload.gymid: 센터 정보
   */
  async reqGetScheduleDataList ({ commit }, { gymid, staffid, date }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_SCHEDULE,
        variables: { gymid, staffid, date }
      })

      commit('setScheduleDataList', data.allSchedule)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqGetScheduleData ({ commit }, { _id, type = void 0 }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_SCHEDULE,
        variables: { _id }
      })
      commit('setScheduleData', {
        data: data.findSchedule,
        type: type
      })
      return {
        code: 'ok'
      }
    } catch (e) {
      return {
        code: 'nok'
      }
    }
  },
  /**
   * 스케줄을 추가한다.
   */
  async reqAddSchedule ({ state, commit, rootState }, { type = void 0 }) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    let row = {}
    if (type === 'lesson') row = _.cloneDeep(state.lessonScheduleData)
    else row = _.cloneDeep(state.scheduleData)
    row.gymid = gymid
    const deleteAttr = ['_id', 'members']
    _.forEach(deleteAttr, key => {
      delete row[key]
    })
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_SCHEDULE,
        variables: { input: row }
      })
      commit('saveScheduleData', data.createSchedule)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 스케줄을 수정 한다.
   */
  async reqUpdateSchedule ({ state, commit }, { type = void 0 } = {}) {
    let _id = void 0
    let row = {}
    if (type === 'lesson') {
      _id = state.lessonScheduleData._id
      row = _.cloneDeep(state.lessonScheduleData)
    } else {
      _id = state.scheduleData._id
      row = _.cloneDeep(state.scheduleData)
    }
    const deleteAttr = ['session', 'room', 'create_d', 'members']
    _.forEach(deleteAttr, key => {
      delete row[key]
    })
    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_SCHEDULE,
        variables: { _id, input: row }
      })
      commit('updateScheduleData', data.updateSchedule)
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  /**
   * 스케줄을 제거 한다.
   */
  async reqRemoveSchedule ({ commit }, { _id }) {
    try {
      await this.$apollo.mutate({
        mutation: DELETE_SCHEDULE,
        variables: { _id }
      })
      commit('deleteScheduleData', _id)
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
