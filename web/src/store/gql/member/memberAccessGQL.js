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
  # 티켓 정보
  ticketid         # 티켓 정보 id
  ticketName
  # 입장 정보
  type             # 입장 유형, (membership, lesson)
  # 기타 정보
  create_d
`

// ALl Read
// page: 현재 페이지, offset: 페이지 수
export const GET_ALL_MEMBER_ACCESS = gql`
  query Read($gymid: String!, $memberid: String, $ticketid: String, $page: Int, $offset: Int, $year: Int) {
    allMemberAccess(gymid: $gymid, memberid: $memberid, ticketid: $ticketid, page: $page, offset: $offset, year: $year) {
      totCnt
      result {
        ${fields}
      }
    }
  }
`

export const GET_MEMBER_ACCESS = gql`
  query Read($_id: String, $gymid: String, $specialn: Int) {
    findMemberAccess(_id: $_id, gymid: $gymid, specialn: $specialn) {
      _id
      # 센터 정보
      # gym
      gymid
      # 회원 정보
      # member
      memberid
      name
      engName
      special_n
      # 티켓 정보
      ticketid         # 티켓 정보 id
      ticketName
      # 입장 정보
      type             # 입장 유형, (membership, lesson)
      # 이용권 및 예약 정보
      membershipTickets {       # 유효 회원권 목록
        session
        sdate
        edate
      }
      lessonTickets {       # 유효 수강권 목록
        _id
        session
        sdate
        edate
        totCnt
        useCnt
        staffPhoto
        staffTeam
        staffName
      }
      reserves {       # 금일 예약한 내역
        _id
        ticketid
        tName
        totCnt
        useCnt
        sdate
        edate
        stime
        etime
        state
      }
      # 기타 정보
      create_d
    }
  }
`

export const CREATE_MEMBER_ACCESS = gql`
  mutation None($input: inputMemberAccess!) {
    createMemberAccess(input: $input) {
      ${fields}
    }
  }
`
