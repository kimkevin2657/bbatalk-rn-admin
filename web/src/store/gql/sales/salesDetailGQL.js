import gql from 'graphql-tag'

// 회원권 매출
export const GET_MEMBERSHIP_SALES = gql`
  query Read ($gymid: String!, $from: String!, $to: String!) {
    searchMembershipSales(gymid: $gymid, from: $from, to: $to) {
      type
      category
      series {
        name
        data
      }
    }
  }
`

// 수강권 매출
export const GET_LESSON_SALES = gql`
  query Read ($gymid: String!, $from: String!, $to: String!) {
    searchLessonSales(gymid: $gymid, from: $from, to: $to) {
      type
      category
      series {
        name
        data
      }
    }
  }
`
