import {
  GET_ALL_TICKET,
  CREATE_TICKET,
  DELETE_BULK_TICKET,
  DELETE_TICKET,
  UPDATE_TICKET,
  GET_TICKET,
  REFUND_TICKET,
  TRANSFER_TICKET,
  Delay_TICKET
} from 'src/store/gql/member/ticketGQL'

const initTicketData = (type = 'membership') => {
  const t = new Date()
  const year = t.getFullYear()
  const month = Number(t.getMonth() + 1) >= 10 ? t.getMonth() + 1 : `0${t.getMonth() + 1}`
  const date = Number(t.getDate()) >= 10 ? t.getDate() : `0${t.getDate()}`
  const currentDate = `${year}-${month}-${date}`
  let res = {
    _id: void 0,
    /* 센터 정보 */
    gymid: void 0,            // 센터 id
    /* 회원 정보 */
    memberid: void 0,         // 상세 회원 정보 id
    name: '',                 // 회원 명
    photo: '',                // 아바타
    engName: '',              // 회원 영어명
    special_n: '',            // 회원 고유번호(출석체크 번호, 핸드폰뒷번호+n)
    phone: '',                // 연락처
    gender: '',               // 성별
    memberType: void 0,       // 회원 구분
    /* 티켓 정보 */
    sessionid: '',            // 회원권 id
    productid: '',            // 회원권 내부의 제품 id
    session: '',              // 세션 명
    month: 0,                 // 개월 (사용안해도 될듯?)
    sdate: currentDate,       // 시작일
    edate: currentDate,       // 종료일
    defPrice: 0,              // 기본 금액
    discount: 0,              // 할인 금액
    addDiscount: 0,           // 추가 할인 금액
    price: 0,                 // 구매가
    /* 결재 정보 */
    priceType: '',            // 카드, 현금, 복합
    cash: 0,                  // 현금 지불 금액
    card: 0,                  // 카드 지불 금액
    cardType: '',             // 카드 유형
    cash_r: '',               // 현금 영수증, 핸드폰번호/사업자번호
    vat: 0,                   // 부가세
    point: 0,                 // 포인트
    purchase: 0,              // 구매가
    pay_state: void 0,        // 결재 상태, 0: 미결재, 1: 결재 완료, 2: 양도, 3: 환불
    pay_d: void 0,            // 결재일
    /* 등록 정보 */
    reg_d: currentDate,       // 등록일
    gifts: [],                // 사은품들 (수건 양말 등등)
    path: '',                 // 등록경로 (법인, 가족, 단체, 입주민)

    /* 환불 정보 */
    refund_reg: void 0,       // 환불 신청 일자
    refund_cause: '',         // 환불 사유
    refund_bank: '',          // 은행명
    refund_account: '',       // 계좌
    refund_name: void 0,      // 예금주
    refund_usePrice: 0,       // 이용 금액
    refund_steal: 0,          // 부가 공제액 (사은품 회수액)
    refund_penalty: 0,        // 위약금
    refund_point: 0,          // 반환 포인트
    refund_price: 0,          // 환불 금액 (환급액)

    /* 기간변경 정보 */
    delayCnt: 0,              // 기간연장 된 횟수
    pauseCnt: 0,              // 일시정지 된 횟수
    /* ETC */
    input_staff: '',          // 입력 직원
    consult_staff: '',        // 상담 직원
    desc: ''                  // 비고/설명
  }
  if (type === 'lesson') {
    /* 티켓 정보 */
    res.team = ''        // 종목
    res.peopleCnt = 0        // 정원
    res.duration = 30        // 회당시간, 일정 시간 부터 종료까지의 Minutes
    res.totCnt = 0           // 총 횟수
    res.useCnt = 0           // 사용 횟수
    res.chkCnt = 0           // 출석 횟수
    res.nchkCnt = 0          // 결석 횟수
    /* 강사 정보 */
    res.staffid = ''          // 상세 강사 정보 id
    res.staffName = ''        // 강사 명
    res.staffEng = ''         // 강사 영어명
    res.staffPhoto = ''       // 강사 사진
    res.staffSpecial_n = ''   // 강사 고유번호
    res.staffTeam = ''        // 강사 팀(PX, PL, 수영...)
  }
  return res
}

const state = {
  membershipData: initTicketData('membership'), // 회원권 정보
  lessonData: initTicketData('lesson'),     // 수강권 정보
  newTicket: initTicketData('lesson'), // 양수자 정보

  membershipDataList: [],           // 회원권 항목
  lessonDataList: []                // 수강권 항목
}

const mutations = {
  // 회원권/수강권 정보 초기화
  initTicketData (state) {
    state.lessonData = initTicketData('lesson')
    state.membershipData = initTicketData('membership')
  },
  // 회원권/수강권 항목 초기화
  initTicketDataList (state) {
    state.membershipDataList = []
    state.lessonDataList = []
  },
  initNewTicketData (state, type) {
    state.newTicket = initTicketData(type)
  },
  // 항목 데이터 삽입
  setTicketDataList (state, { payload, type }) {
    const stateDict = {
      'membership': 'membershipDataList',
      'lesson': 'lessonDataList'
    }
    if (!_.isArray(payload)) return
    state[stateDict[type]] = Object.freeze(payload)
  },
  // 티켓 데이터 삽입
  setTicketData (state, { payload, type }) {
    const stateDict = {
      'membership': 'membershipData',
      'lesson': 'lessonData'
    }
    state[stateDict[type]] = _.assignIn(payload, {
      sdate: this.$moment(payload.sdate).format('YYYY-MM-DD'),
      edate: this.$moment(payload.edate).format('YYYY-MM-DD')
    })
  },
  // 티켓 데이터를 항목에 추가
  addTicketData (state, { payload, type }) {
    const stateDict = {
      'membership': 'membershipDataList',
      'lesson': 'lessonDataList'
    }
    let tempDataList = _.cloneDeep(_.get(state, [stateDict[type]]))
    tempDataList.unshift(payload)
    state[stateDict[type]] = Object.freeze(tempDataList)
  },
  // 티켓 데이터를 항목에 제거
  deleteTicket (state, { payload, type }) {
    const stateDict = {
      'membership': 'membershipDataList',
      'lesson': 'lessonDataList'
    }
    const tempDataList = _.cloneDeep(_.get(state, [stateDict[type]]))
    if (_.has(payload, 'ids')) {
      const ids = payload.ids
      for (let i = 0, l = ids.length; i < l; i++) {
        const _id = ids[i]
        const ticketIndex = _.findIndex(tempDataList, o => {
          return o._id === _id
        })
        if (ticketIndex === -1) continue
        tempDataList.splice(ticketIndex, 1)
      }
    } else {
      const _id = payload._id
      const ticketIndex = _.findIndex(tempDataList, o => {
        return o._id === _id
      })
      if (ticketIndex === -1) return
      tempDataList.splice(ticketIndex, 1)
    }
    state[stateDict[type]] = Object.freeze(tempDataList)
  },
  updateTicket (state, { payload, type }) {
    const stateDict = {
      'membership': 'membershipDataList',
      'lesson': 'lessonDataList'
    }
    const tempDataList = _.cloneDeep(_.get(state, [stateDict[type]]))
    let row = _.forEach(tempDataList, (o, index) => {
      if (o._id === payload._id) {
        tempDataList[index] = payload
      }
    })
    if (!row) return
    state[stateDict[type]] = Object.freeze(tempDataList)
  },
  // 양도 티켓 설정
  setNewTicket (state, payload) {
    state.newTicket = _.cloneDeep(payload)
  }
}

const actions = {
  // 티켓 목록 가져오기
  async reqGetTicketDataList ({ commit, rootState }, { type = '', memberid = void 0, date = void 0, sessionid = void 0, isvalid = false } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    try {
      const { data } = await this.$apollo.query({
        query: GET_ALL_TICKET,
        variables: { gymid, type, memberid, date, sessionid, isvalid }
      })
      commit('setTicketDataList', { payload: data.allTicket, type })
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 상세 티켓 정보 가져오기
  async reqGetTicketData ({ commit }, { _id, type = '' }) {
    try {
      const { data } = await this.$apollo.query({
        query: GET_TICKET,
        variables: { _id, type }
      })
      commit('setTicketData', { payload: data.findTicket, type })
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 티켓 추가
  async reqAddTicket ({ state, commit, rootState }, { type = '' } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    let row = {}
    if (type === 'membership') row = _.cloneDeep(state.membershipData)
    else if (type === 'lesson') row = _.cloneDeep(state.lessonData)
    row.gymid = gymid
    const deleteAttr = ['_id', 'family', 'gym']
    _.forEach(deleteAttr, key => {
      delete row[key]
    })
    try {
      const { data } = await this.$apollo.mutate({
        mutation: CREATE_TICKET,
        variables: { input: row, type, gymid }
      })
      commit('addTicketData', { payload: data.createTicket, type })
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 티켓 제거
  async reqRemoveTicket ({ commit }, { _id = '', ids = void 0, type = '' }) {
    if (_.isArray(ids)) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_BULK_TICKET,
          variables: { idList: ids, type }
        })
        commit('deleteTicket', { payload: { ids }, type })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    } else {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_TICKET,
          variables: { _id, type }
        })
        commit('deleteTicket', { payload: { _id: data.deleteTicket._id }, type })
        return { code: 'ok' }
      } catch (e) {
        return { code: 'nok' }
      }
    }
  },
  // 티켓 편집
  async reqUpdateTicket ({ state, commit }, { type = '', row = void 0 } = {}) {
    if (!row) {
      if (type === 'membership') {
        row = _.cloneDeep(state.membershipData)
      }
      if (type === 'lesson') {
        row = _.cloneDeep(state.lessonData)
      }
    }
    let _id = row._id
    const deleteAttr = ['_id', 'family', 'gym', 'delayTickets']
    _.forEach(deleteAttr, key => {
      delete row[key]
    })
    try {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_TICKET,
        variables: { _id, input: row, type }
      })
      commit('updateTicket', { payload: data.updateTicket, type })
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 티켓 환불
  async reqRefundTicket ({ state, commit }, { type = '', row = void 0 } = {}) {
    if (!row) {
      if (type === 'membership') {
        row = _.cloneDeep(state.membershipData)
      }
      if (type === 'lesson') {
        row = _.cloneDeep(state.lessonData)
      }
    }
    let _id = row._id
    const deleteAttr = ['_id', 'family', 'gym']
    _.forEach(deleteAttr, key => {
      delete row[key]
    })
    try {
      const { data } = await this.$apollo.mutate({
        mutation: REFUND_TICKET,
        variables: { _id, input: row, type }
      })
      commit('updateTicket', { payload: data.refundTicket, type })
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  // 티켓 양도
  async reqTransferTicket ({ state, commit, rootState }, { type = '' } = {}) {
    const gymid = _.get(rootState, ['auth', 'gymInfo', 'id'])
    if (!gymid) throw new Error('센터 정보를 찾을 수 없습니다.')
    // 양수자 설정
    const assignor = _.cloneDeep(state.newTicket)
    assignor.gymid = gymid
    // 양도자 설정
    let transfer = void 0
    if (type === 'lesson') transfer = _.cloneDeep(state.lessonData)
    if (type === 'membership') transfer = _.cloneDeep(state.membershipData)
    const deleteAttr = ['family', 'gym']
    _.forEach(deleteAttr, key => {
      delete transfer[key]
    })
    try {
      const { data } = await this.$apollo.mutate({
        mutation: TRANSFER_TICKET,
        variables: {
          type,
          assignorInput: assignor,
          transferInput: transfer
        }
      })
      commit('updateTicket', { payload: _.get(data, ['transferTicket', 'transfer']), type })
      commit('addTicketData', { payload: _.get(data, ['transferTicket', 'assignor']), type })
      return { code: 'ok' }
    } catch (e) {
      return { code: 'nok' }
    }
  },
  async reqDelayTicket ({ state, commit, rootState }, { type = '', row = void 0 } = {}) {
    if (!row) {
      if (type === 'membership') {
        row = _.cloneDeep(state.membershipData)
      }
      if (type === 'lesson') {
        row = _.cloneDeep(state.lessonData)
      }
    }
    let _id = row._id
    const deleteAttr = ['_id', 'family', 'gym']
    _.forEach(deleteAttr, key => {
      delete row[key]
    })
    const delayInput = _.get(rootState, ['delayTicket', 'delayTicketData'], void 0)
    try {
      const { data } = await this.$apollo.mutate({
        mutation: Delay_TICKET,
        variables: { _id, input: row, type, delayInput }
      })
      commit('updateTicket', { payload: data.delayTicket, type })
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
