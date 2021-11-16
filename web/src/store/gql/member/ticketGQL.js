import gql from 'graphql-tag'

const fields = `
  # 회원 정보
  _id
  gymid
  memberid
  name
  engName
  special_n
  phone
  photo
  gender
  # 강사 정보
  staffid
  staffName
  staffEng
  staffTeam
  staffSpecial_n
  staffPhoto
  # 세션 정보
  sessionid
  productid
  session
  month
  sdate
  edate
  price
  peopleCnt
  duration
  totCnt
  useCnt
  chkCnt
  nchkCnt
  # 결재 정보
  priceType
  purchase
  pay_state
  pay_d
  # 기간변경 정보
  delayCnt  # 연장 된 횟수
  pauseCnt  # 일시정지 된 횟수
  # 기타
  delayTickets {
    type
    pause_sdate
    pause_edate
  }
  reg_d
  gifts
  path
  regPath
  input_staff
  consult_staff
  desc
`
// ALl Read
export const GET_ALL_TICKET = gql`
  query Read($gymid: String!, $type: String!, $memberid: String, $date: String, $sessionid: String, $isvalid: Boolean) {
    allTicket(gymid: $gymid, type: $type, memberid: $memberid, date: $date, sessionid: $sessionid, isvalid: $isvalid) {
      ${fields}
    }
  }
`

export const GET_TICKET = gql`
  query Read($_id: String!, $type: String!) {
    findTicket(_id: $_id, type: $type) {
      _id
      gym {
        name
      }
      gymid
      memberid
      name
      engName
      special_n
      phone
      photo
      gender
      staffid
      staffName
      staffEng
      staffTeam
      staffSpecial_n
      staffPhoto
      sessionid
      productid
      session
      month
      sdate
      edate
      defPrice                 # 기본 금액
      discount                 # 할인 금액
      addDiscount              # 추가 할인 금액
      price                    # 구매가
      peopleCnt                # 정원
      duration
      totCnt
      useCnt
      chkCnt
      nchkCnt
      # 결제 정보
      priceType
      cash
      card
      cardType
      cash_r
      vat
      point
      purchase
      pay_state               # 결재 상태, 0: 미결재, 1: 결재, 2: 양도, 3: 환불
      pay_d                   # 결재일
      reg_d
      gifts
      path
      # 환불 정보
      refund_reg          # 환불 일자
      refund_cause        # 환불 사유
      refund_bank         # 은행 명
      refund_account      # 계좌
      refund_name         # 예금주
      refund_usePrice     # 이용금액 (실 사용금액)
      refund_steal        # 부가 공제액 (사은품 회수액)
      refund_point        # 포인트 차감
      refund_penalty      # 위약금
      refund_price        # 환불 금액 (환급액)
      # 기간변경 정보
      delayCnt  # 연장 신청 횟수
      pauseCnt  # 일시정지 신청 횟수
      # 기타 정보
      input_staff
      consult_staff
      regPath
      desc
    }
  }
`

export const GET_PAGE_TICKET = gql`
  query Read($gymid: String!, $type: String!, $from: String!, $to: String!, $page: Int!, $offset: Int!) {
    pageSalesTicket(gymid: $gymid, type: $type, from: $from, to: $to, page: $page, offset: $offset) {
      totCnt
      result {
        ${fields}
        defPrice
        discount
        addDiscount
        priceType
        cash
        card
        point
        vat
        memberid
        sessionid
      }
    }
  }
`

export const CREATE_TICKET = gql`
  mutation Create($type: String!, $input: inputTicket!, $force: Boolean) {
    createTicket(type: $type, input: $input, force: $force) {
      ${fields}
    }
  }
`

export const UPDATE_TICKET = gql`
  mutation Update($_id: String!, $type: String! $input: inputTicket!, $force: Boolean) {
    updateTicket(_id: $_id, type: $type, input: $input, force: $force) {
      ${fields}
    }
  }
`

export const DELETE_TICKET = gql`
  mutation Delete($_id: String!, $type: String!) {
    deleteTicket(_id: $_id, type: $type) {
      _id
    }
  }
`

export const DELETE_BULK_TICKET = gql`
  mutation Delete($type: String!, $idList: [String]!) {
    bulkDeleteTicket(type: $type, idList: $idList)
  }
`

export const REFUND_TICKET = gql`
  mutation Refund($_id: String!, $type: String! $input: inputTicket!) {
    refundTicket(_id: $_id, type: $type, input: $input) {
      ${fields}
    }
  }
`

export const TRANSFER_TICKET = gql`
  mutation Transfer($type: String!, $transferInput: inputTicket!, $assignorInput: inputTicket!) {
    transferTicket(type: $type, transferInput: $transferInput, assignorInput: $assignorInput) {
      transfer {
        ${fields}
      }
      assignor {
        ${fields}
      }
    }
  }
`

export const Delay_TICKET = gql`
  mutation Update($_id: String!, $type: String! $input: inputTicket!, $delayInput: inputDelayTicket!) {
    delayTicket(_id: $_id, type: $type, input: $input, delayInput: $delayInput) {
      ${fields}
    }
  }
`
