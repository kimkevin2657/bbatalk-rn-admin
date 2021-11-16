import gql from 'graphql-tag'

const fields = `
  _id
  gymid
  special_n
  photo
  name
  engName
  gender
  phone
  #email
  #regDate
  #regType
  regPath
  birth
  address_f
  address_l
  memberType
  memberGroup
  point
  # familyid
  organization
  recommenderid
  carNumber_f
  carNumber_l
  regMemo
  lessonTickets {
    session
    delayTickets {
      type
      pause_sdate
      pause_edate
    }
  }
  membershipTickets {
    session
    delayTickets {
      type
      pause_sdate
      pause_edate
    }
  }
  purchase {
    totalCnt         # 총 구매 횟수
    lessonCnt        # 수강권 구매 횟수
    membershipCnt    # 회원권 구매 횟수
    tPrice           # 총 구매금
    uPrice           # 총 미수금
    rPrice           # 총 환불금
    yPrices {        # 년도별 구매금 {year, price}
      year
      price
    }
    teamList         # 구매한 수강권 종목 리스트
  }
`

// ALl Read
export const GET_ALL_MEMBER = gql`
  query Read($gymid: String!, $name: String) {
    allMember(gymid: $gymid, name: $name) {
      ${fields}
    }
  }
`

// 회원검색 항목
export const GET_SEARCH_MEMBER = gql`
  query Search($gymid: String!, $name: String) {
    allMember(gymid: $gymid, name: $name) {
      _id
      special_n
      photo
      name
      gender
      phone
      birth
      point
      memberType
    }
  }
`

export const GET_MEMBER = gql`
  query Read($_id: String!) {
    findMember(_id: $_id) {
      _id
      gymid
      special_n
      photo
      name
      engName
      gender
      ranking
      phone
      email
      regDate
      regType
      regPath
      birth
      address_f
      address_l
      memberType
      memberGroup
      point
      familyids
      familys { # 소속(가족)
        _id
        name
        special_n
      }
      organization
      recommenderid
      recommender { # 소개자
        _id
        name
        special_n
      }
      carNumber_f
      carNumber_l
      purchase {
        totalCnt         # 총 구매 횟수
        lessonCnt        # 수강권 구매 횟수
        membershipCnt    # 회원권 구매 횟수
        tPrice           # 총 구매금
        uPrice           # 총 미수금
        rPrice           # 총 환불금
        yPrices {        # 년도별 구매금 {year, price}
          year
          price
        }
        teamList         # 구매한 수강권 종목 리스트
      }
      regMemo
    }
  }
`

export const CREATE_MEMBER = gql`
  mutation Create($input: inputMember!) {
    createMember(input: $input) {
      ${fields}
    }
  }
`

export const UPDATE_MEMBER = gql`
  mutation Update($_id: String!, $input: inputMember!) {
    updateMember(_id: $_id, input: $input) {
      ${fields}
    }
  }
`

export const DELETE_MEMBER = gql`
  mutation Delete($_id: String!) {
    deleteMember(_id: $_id) {
      _id
    }
  }
`

export const DELETE_BULK_MEMBER = gql`
  mutation Delete($idList: [String]!) {
    bulkDeleteMember(idList: $idList)
  }
`
