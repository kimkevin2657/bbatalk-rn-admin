import gql from 'graphql-tag'

const fields = `
  # 기본 정보
  _id
  gymid
  name
  eng
  # 락커 그룹
  cnt
  # defineData 유형
  type
  # 수강권, 회원권, 룸
  team
  # 수강권, 회원권
  peopleCnt
  duration
  defPrice
  # 환불 정책
  refundPrice # 환불 기본 금액 (1일/1회 금액)
  # 기간연장 정책
  delayCnt         # 연장 가능 횟수
  delayDay         # 연장 가능 일
  pauseCnt         # 일시정지 가능 횟수
  pauseDay         # 일시정지 가능 일
  product {
    id
    month
    totCnt
    price
    discount
  }
  # 회원등급
  rankPrice
  # 기타
  desc
  create_d
`

// All Read
export const GET_ALL_DEFINE = gql`
  query Read($gymid: String!, $type: String!) {
    allDefineData(gymid: $gymid, type: $type) {
      ${fields}
    }
  }
`

// Read
export const GET_DEFINE = gql`
  query Read($_id: String!, $type: String!) {
    findDefineData(_id: $_id, type: $type) {
      ${fields}
    }
  }
`

// Create
export const CREATE_DEFINE = gql`
  mutation Create($type: String!, $input: inputDefineData!) {
    createDefineData(type: $type, input: $input) {
      ${fields}
    }
  }
`

// Update
export const UPDATE_DEFINE = gql`
  mutation Update($_id: String!, $type: String!, $input: inputDefineData!) {
    updateDefineData(_id: $_id, type: $type, input: $input) {
      ${fields}
    }
  }
`

// Delete
export const DELETE_DEFINE = gql`
  mutation Delete($_id: String!, $type: String!) {
    deleteDefineData(_id: $_id, type: $type) {
      ${fields}
    }
  }
`

// BulkDelete
export const DELETE_BULK_DEFINE = gql`
  mutation Delete($type: String!, $idList: [String]!) {
    bulkDeleteDefineData(type: $type, idList: $idList)
  }
`
