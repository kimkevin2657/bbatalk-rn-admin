import gql from 'graphql-tag'

const fields = `
  _id
  # 센터 정보
  gymid
  # 회원 정보
  memberid
  name
  engName
  special_n
  # 강사 정보
  staffid
  staffName
  staffEng
  staffSpecial_n
  # 티켓 정보
  ticketid # 티켓 정보 id
  ticketName
  # 연장 정보
  type                     # 연장 유형 (delay, pause)
  d_type                   # 기간 연장 유형 (lesson, membership)
  before_sdate             # 변경 전 시작일
  before_edate             # 변경 후 종료일
  pause_sdate              # 연장 시작일
  pause_edate              # 연장 종료일
  after_sdate              # 변경 후 시작일
  after_edate              # 변경 후 종료일
  cause                    # 기간 연장 사유
  reg_d                    # 기간연장 신청일
  # 기타 정보
  input_staff
  create_d
`
// ALl Read
export const GET_ALL_DELAY_TICKET = gql`
  query Read($gymid: String!, $memberid: String, $ticketid: String) {
    allDelayTicket(gymid: $gymid, memberid: $memberid, ticketid: $ticketid) {
      ${fields}
    }
  }
`

export const GET_DELAY_TICKET = gql`
  query Read($_id: String!) {
    findDelayTicket(_id: $_id) {
      ${fields}
    }
  }
`
