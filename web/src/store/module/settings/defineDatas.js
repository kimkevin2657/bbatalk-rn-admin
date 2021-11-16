/**
 * 모든 데이터 정의 데이터 관련
 */

import {
  GET_ALL_DEFINE,
  GET_DEFINE,
  CREATE_DEFINE,
  UPDATE_DEFINE,
  DELETE_DEFINE,
  DELETE_BULK_DEFINE
} from 'src/store/gql/settings/defineDataGQL'

const initDefineData = (type) => {
  let res = {
    // 기본 정보
    _id: void 0,
    gymid: '',
    name: '',
    eng: void 0,
    // defineData 유형
    type: type,
    // 락커 수
    cnt: 30,
    // 수강권, 회원권, 룸
    team: void 0,
    // 수강권, 회원권
    peopleCnt: 1,
    duration: 60,
    defPrice: type === 'lockergroup' ? 10000 : 50000,
    // 환불 정책
    refundPrice: 10000,
    // 기간연장 정책
    delayCnt: 0,    // 연장 가능 횟수
    delayDay: 0,    // 연장 가능 일수
    pauseCnt: 3,    // 일시정지 가능 횟수
    pauseDay: 30,   // 일시정지 가능 일수
    // 상세 상품
    product: [],
    // 회원 등급
    rankPrice: 1000000,
    // 기타
    desc: ''
  }
  // if (type === '')
  return res
}

const state = {
  // 문의 현황
  inquiryDefineDataList: [],
  inquiryDefineData: initDefineData('inquiry'),
  // 마케팅 경로 설정
  marketingPathDefineDataList: [],
  marketingPathDefineData: initDefineData('marketingpath'),
  // 회원 구분
  memberTypeDefineDataList: [],
  memberTypeDefineData: initDefineData('membertype'),
  // 회원 등급
  memberRankDefineDataList: [],
  memberRankDefineData: initDefineData('memberrank'),
  // 회원 분류
  memberGroupDefineDataList: [],
  memberGroupDefineData: initDefineData('membergroup'),

  // 등록 경로
  regPathDefineDataList: [],
  regPathDefineData: initDefineData('regpath'),

  // 등록 구분
  regTypeDefineDataList: [],
  regTypeDefineData: initDefineData('regtype'),

  // 회원권 설정
  membershipDefineDataList: [],
  membershipDefineData: initDefineData('membership'),

  // 수강권 설정
  lessonDefineDataList: [],
  lessonDefineData: initDefineData('lesson'),

  // 락커 그룹 설정
  lockerGroupDataList: [],
  lockerGroupData: initDefineData('locker'),

  // 부서 구분 (PT, PL, 골프, 베드민턴, 수영, 스쿼시, 탁구)
  departmentDefineDataList: [],
  departmentDefineData: initDefineData('department'),

  // 직급 구분
  rankDefineDataList: [],
  rankDefineData: initDefineData('rank'),

  // 룸 설정
  roomDefineDataList: [],
  roomDefineData: initDefineData('room')
}

const mutations = {
  // 초기화
  setChange (state, payload) {
    state.isChanged = payload
  },
  initDefineData (state) {
    state.inquiryDefineData = initDefineData('inquiry')
    state.marketingPathDefineData = initDefineData('marketingpath')
    state.memberTypeDefineData = initDefineData('membertype')
    state.memberRankDefineData = initDefineData('memberrank')
    state.memberGroupDefineData = initDefineData('membergroup')
    state.regPathDefineData = initDefineData('regpath')
    state.regTypeDefineData = initDefineData('regtype')
    state.lessonDefineData = initDefineData('lesson')
    state.membershipDefineData = initDefineData('membership')
    state.departmentDefineData = initDefineData('department')
    state.rankDefineData = initDefineData('rank')
    state.roomDefineData = initDefineData('room')
    state.lockerGroupData = initDefineData('lockergroup')
  },
  initDefineDataList (state) {
    state.inquiryDefineDataList = []
    state.marketingPathDefineDataList = []
    state.memberTypeDefineDataList = []
    state.memberRankDefineDataList = []
    state.memberGroupDefineDataList = []
    state.regPathDefineDataList = []
    state.regTypeDefineDataList = []
    state.lessonDefineDataList = []
    state.membershipDefineDataList = []
    state.departmentDefineDataList = []
    state.rankDefineDataList = []
    state.roomDefineDataList = []
    state.lockerGroupDataList = []
  },
  /**
   * 서버에서 가져온 데이터와 최초 데이터 삽입
   */
  setDefineDataList (state, { payload, type }) {
    const stateDict = {
      inquiry: 'inquiryDefineDataList',
      marketingpath: 'marketingPathDefineDataList',
      membertype: 'memberTypeDefineDataList',
      memberrank: 'memberRankDefineDataList',
      membergroup: 'memberGroupDefineDataList',
      regpath: 'regPathDefineDataList',
      regtype: 'regTypeDefineDataList',
      lesson: 'lessonDefineDataList',
      membership: 'membershipDefineDataList',
      lockergroup: 'lockerGroupDataList',
      department: 'departmentDefineDataList',
      rank: 'rankDefineDataList',
      room: 'roomDefineDataList'
    }
    if (!_.isArray(payload)) return
    state[stateDict[type]] = Object.freeze(payload)
  },
  pushDefineData (state, { payload, type }) {
    const stateDict = {
      inquiry: 'inquiryDefineDataList',
      marketingpath: 'marketingPathDefineDataList',
      membertype: 'memberTypeDefineDataList',
      memberrank: 'memberRankDefineDataList',
      membergroup: 'memberGroupDefineDataList',
      regpath: 'regPathDefineDataList',
      regtype: 'regTypeDefineDataList',
      lesson: 'lessonDefineDataList',
      membership: 'membershipDefineDataList',
      lockergroup: 'lockerGroupDataList',
      department: 'departmentDefineDataList',
      rank: 'rankDefineDataList',
      room: 'roomDefineDataList'
    }
    let tempDataList = _.cloneDeep(_.get(state, [stateDict[type]]))
    tempDataList.push(payload)
    state[stateDict[type]] = Object.freeze(tempDataList)
  },
  updateDefineData (state, { payload, type }) {
    const stateDict = {
      inquiry: 'inquiryDefineDataList',
      marketingpath: 'marketingPathDefineDataList',
      membertype: 'memberTypeDefineDataList',
      memberrank: 'memberRankDefineDataList',
      membergroup: 'memberGroupDefineDataList',
      regpath: 'regPathDefineDataList',
      regtype: 'regTypeDefineDataList',
      lesson: 'lessonDefineDataList',
      membership: 'membershipDefineDataList',
      lockergroup: 'lockerGroupDataList',
      department: 'departmentDefineDataList',
      rank: 'rankDefineDataList',
      room: 'roomDefineDataList'
    }
    let defineDataList = _.get(state, [stateDict[type]])
    let tempDataList = _.cloneDeep(defineDataList)
    let rowIndex = _.findIndex(tempDataList, (o) => {
      return o._id === payload._id
    })
    if (rowIndex === -1) return
    tempDataList[rowIndex] = payload
    state[stateDict[type]] = Object.freeze(tempDataList)
  },
  deleteDefineData (state, { payload, type }) {
    const stateDict = {
      inquiry: 'inquiryDefineDataList',
      marketingpath: 'marketingPathDefineDataList',
      membertype: 'memberTypeDefineDataList',
      memberrank: 'memberRankDefineDataList',
      membergroup: 'memberGroupDefineDataList',
      regpath: 'regPathDefineDataList',
      regtype: 'regTypeDefineDataList',
      lesson: 'lessonDefineDataList',
      membership: 'membershipDefineDataList',
      lockergroup: 'lockerGroupDataList',
      department: 'departmentDefineDataList',
      rank: 'rankDefineDataList',
      room: 'roomDefineDataList'
    }
    let defineDataList = _.get(state, [stateDict[type]])
    let tempDataList = _.cloneDeep(defineDataList)
    if (_.has(payload, 'ids')) {
      const ids = payload.ids
      for (let i = 0, l = ids.length; i < l; i++) {
        const _id = ids[i]
        const memberIndex = _.findIndex(tempDataList, o => {
          return o._id === _id
        })
        if (payload === -1) return
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
    state[stateDict[type]] = Object.freeze(tempDataList)
  },
  setDefineData (state, { type, value } = {}) {
    const dictType = {
      inquiry: 'inquiryDefineData',
      marketingpath: 'marketingPathDefineData',
      membertype: 'memberTypeDefineData',
      memberrank: 'memberRankDefineData',
      membergroup: 'memberGroupDefineData',
      regpath: 'regPathDefineData',
      regtype: 'regTypeDefineData',
      lesson: 'lessonDefineData',
      membership: 'membershipDefineData',
      lockergroup: 'lockerGroupData',
      department: 'departmentDefineData',
      rank: 'rankDefineData',
      room: 'roomDefineData'
    }
    state[dictType[type]] = value
  }
}

const actions = {
  // 정의 데이터 리스트 가져오기
  async reqGetDefineDataList ({ commit, rootState }, { type = '' } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_DEFINE,
        variables: { gymid, type }
      })
      commit('setDefineDataList', { payload: data.allDefineData, type: type })
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 상세 데이터 정보 가져오기
  async reqGetDefineData ({ commit }, { type, _id }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_DEFINE,
        variables: { type, _id }
      })
      commit('setDefineData', { type: type, value: data.findDefineData })
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 정의 데이터 추가
  async reqAddDefineData ({ commit }, type) {
    const dictType = {
      inquiry: 'inquiryDefineData',
      marketingpath: 'marketingPathDefineData',
      membertype: 'memberTypeDefineData',
      memberrank: 'memberRankDefineData',
      membergroup: 'memberGroupDefineData',
      regpath: 'regPathDefineData',
      regtype: 'regTypeDefineData',
      lesson: 'lessonDefineData',
      membership: 'membershipDefineData',
      lockergroup: 'lockerGroupData',
      department: 'departmentDefineData',
      rank: 'rankDefineData',
      room: 'roomDefineData'
    }
    const row = _.cloneDeep(state[dictType[type]])
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_DEFINE,
        variables: { type: row.type, input: row }
      })
      commit('pushDefineData', { payload: data.createDefineData, type: row.type })
      return { code: 'ok' }
    } catch ({ code, msg }) {
      return { code: 'nok' }
    }
  },
  // 정의 데이터 제거
  async reqRemoveDefineData ({ commit }, { _id = '', type = '', ids = void 0 } = {}) {
    if (ids) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_BULK_DEFINE,
          variables: { type: type, idList: ids }
        })
        commit('deleteDefineData', { payload: { ids }, type })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    } else {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_DEFINE,
          variables: { _id, type }
        })
        commit('deleteDefineData', { payload: data.deleteDefineData, type })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    }
  },
  // 정의 데이터 수정
  async reqUpdateDefineData ({ commit }, { _id, type } = {}) {
    const dictType = {
      inquiry: 'inquiryDefineData',
      marketingpath: 'marketingPathDefineData',
      membertype: 'memberTypeDefineData',
      memberrank: 'memberRankDefineData',
      membergroup: 'memberGroupDefineData',
      regpath: 'regPathDefineData',
      regtype: 'regTypeDefineData',
      lesson: 'lessonDefineData',
      membership: 'membershipDefineData',
      lockergroup: 'lockerGroupData',
      department: 'departmentDefineData',
      rank: 'rankDefineData',
      room: 'roomDefineData'
    }
    const row = _.cloneDeep(state[dictType[type]])
    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_DEFINE,
        variables: { _id: _id, type: type, input: row }
      })
      commit('updateDefineData', { payload: data.updateDefineData, type: type })
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  }
}

const getters = {
  memberTypeOpts (state) {
    let row = state.memberDefineDataList[0]
    if (!row) return
    return row.memberTypeList
  },
  memberRankOpts (state) {
    let row = state.memberDefineDataList[0]
    if (!row) return
    return row.memberRankList
  },
  memberGroupOpts (state) {
    let row = state.memberDefineDataList[0]
    if (!row) return
    return row.memberGroupList
  },
  regTypeOpts (state) {
    let row = state.memberDefineDataList[0]
    if (!row) return
    return row.regTypeList
  },
  regPathOpts (state) {
    let row = state.memberDefineDataList[0]
    if (!row) return
    return row.regPathList
  },
  marketingPathOpts (state) {
    let row = state.memberDefineDataList[0]
    if (!row) return
    return row.marketingPathList
  },
  // 수강 설정 데이터
  membershipOpts (state) {
    var dataList = _.cloneDeep(state.lessonDefineDataList)
    dataList.splice(0, 1)

    var opts = []
    _.forEach(dataList, (data) => {
      if (data.lessonType === '회원권') {
        opts.push(data.lesson)
      }
    })
    return opts
  },
  lessonTypeOpts (state) {
    var dataList = _.cloneDeep(state.lessonDefineDataList)
    dataList.splice(0, 1)

    var opts = []
    _.forEach(dataList, (data) => {
      let target = _.find(opts, (o) => {
        return o === data.lessonType
      })
      if (!target && data.lessonType !== '회원권') {
        opts.push(data.lessonType)
      }
    })
    return opts
  },

  // 일괄 방식
  allLessonOpts (state) {
    var dataList = _.cloneDeep(state.lessonDefineDataList)
    dataList.splice(0, 1)

    var opts = []
    _.forEach(dataList, (data) => {
      if (data.lessonType === '회원권') {
        _.forEach(data.priceData.priceList, (price) => {
          var obj = {}
          obj.label = data.lessonType + ' ' + data.lesson + ' ' + '(' + price.month + '개월)'
          obj.value = obj.label
          obj.lessonType = data.lessonType
          obj.lesson = data.lesson
          opts.push(obj)
        })
      } else {
        _.forEach(data.priceData.priceList, (price) => {
          var obj = {}
          obj.label = data.lessonType + ' ' + data.lesson + ' [1:' + price.peopleCount + '] ' + price.lessonNumber + '회(' + price.month + '개월)'
          obj.value = obj.label
          obj.lessonType = data.lessonType
          obj.lesson = data.lesson
          opts.push(obj)
        })
      }
    })
    return opts
  },

  // 직원 부서
  departmentOpts (state) {
    return state.departmentDefineDataList
  },
  // 직원 직급
  rankOpts (state) {
    return state.rankDefineDataList
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
