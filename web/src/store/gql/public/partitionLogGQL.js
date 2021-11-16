import gql from 'graphql-tag'
// 년도별 정보 목록 요청
// ALL Read
export const GET_ALL_PARTIONLOG = gql`
  query Read($type: String) {
    allPartitionLog(type: $type) {
      name
      year
    }
  }
`
