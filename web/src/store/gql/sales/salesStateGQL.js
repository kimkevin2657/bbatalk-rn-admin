import gql from 'graphql-tag'

// 매출 통계
export const GET_SALES_STATS = gql`
  query Read ($gymid: String!, $from: String!, $to: String!) {
    searchSalesStats(gymid: $gymid, from: $from, to: $to) {
      membership {
        sales
        cnt
        refund
        rcnt
      }
      lesson {
        sales
        cnt
        refund
        rcnt
      }
      option {
        sales
        cnt
        refund
        rcnt
      }
      total {
        sales
        cnt
        refund
        rcnt
      }
    }
  }
`
// 회원유형 건수
export const GET_MEMBERSHIP_TYPE_WIDGET = gql`
  query Read ($gymid: String!, $from: String!, $to: String!) {
    searchMembershipType(gymid: $gymid, from: $from, to: $to) {
      type
      category
      series {
        name
        data
      }
    }
  }
`

// 회원권 건수
export const GET_MEMBERSHIP_TICKET_WIDGET = gql`
  query Read ($gymid: String!, $from: String!, $to: String!) {
    searchMembershipTicket(gymid: $gymid, from: $from, to: $to) {
      type
      category
      series {
        name
        data
      }
    }
  }
`

// 수강팀 계약 건수
export const GET_LESSON_TEAM_WIDGET = gql`
  query Read ($gymid: String!, $from: String!, $to: String!) {
    searchLessonTeam(gymid: $gymid, from: $from, to: $to) {
      type
      category
      series {
        name
        data
      }
    }
  }
`
// 수강권 계약 건수
export const GET_LESSON_TICKET_WIDGET = gql`
  query Read ($gymid: String!, $from: String!, $to: String!) {
    searchLessonTicket(gymid: $gymid, from: $from, to: $to) {
      type
      category
      series {
        name
        data
      }
    }
  }
`

// 매출 상위 고객 Top10
export const GET_MEMBER_TOP_TEN_WIDGET = gql`
  query Read ($gymid: String!, $from: String!, $to: String!) {
    searchMemberTopTen(gymid: $gymid, from: $from, to: $to) {
      _id
      name
      special_n
      engName
      photo
      gender
      price
    }
  }
`

// 실적 상위 고객 Top10
export const GET_STAFF_TOP_TEN_WIDGET = gql`
  query READ ($gymid: String!, $from: String!, $to: String!) {
    searchStaffTopTen(gymid: $gymid, from: $from, to: $to) {
      _id
      name
      team
      special_n
      engName
      photo
      price
    }
  }
`
