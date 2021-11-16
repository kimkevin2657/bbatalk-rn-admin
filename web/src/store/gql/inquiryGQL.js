import gql from 'graphql-tag'

// ALl Read (query는 데이터를 읽는데 사용 // mutation은 데이터를 변조하는데 사용)
export const GET_ALL_INQUIRY = gql`
  query Read($gymid: String!, $name: String) {
    allInquiry(gymid: $gymid, name: $name) {
    _id
    address
    centerList
    gym
    gymid
    surveyDate
    name
    gender
    phone
    membershipType
    lessonType
    marketingPath
    coupon
    couponChk
    visit
    regChk
    survey
  }
}
`

// 문의 검색 항목
export const GET_SEARCH_INQUIRY = gql`
  query Search($gymid: String!, $name: String) {
    allInquiry(gymid: $gymid, name: $name) {
      _id
      name
    }
  }
`

export const GET_INQUIRY = gql`
  query Read($_id: String!) {
    findInquiry(_id: $_id) {
    _id
    address
    centerList
    gym
    gymid
    surveyDate
    name
    gender
    phone
    membershipType
    lessonType
    marketingPath
    coupon
    couponChk
    visit
    regChk
    survey
    }
  }
`

export const CREATE_INQUIRY = gql`
  mutation Create($input: inputInquiry!) {
    createInquiry(input: $input) {
    _id
    address
    centerList
    gym
    gymid
    surveyDate
    name
    gender
    phone
    membershipType
    lessonType
    marketingPath
    coupon
    couponChk
    visit
    regChk
    survey
    }
  }
`

export const UPDATE_INQUIRY = gql`
  mutation Update($_id: String!, $input: inputInquiry!) {
    updateInquiry(_id: $_id, input: $input) {
    _id
    address
    centerList
    gym
    gymid
    surveyDate
    name
    gender
    phone
    membershipType
    lessonType
    marketingPath
    coupon
    couponChk
    visit
    regChk
    survey
    }
  }
`

export const DELETE_INQUIRY = gql`
  mutation Delete($_id: String!) {
    deleteInquiry(_id: $_id) {
      _id
    }
  }
`

export const DELETE_BULK_INQUIRY = gql`
  mutation Delete($idList: [String]!) {
    bulkDeleteInquiry(idList: $idList)
  }
`
