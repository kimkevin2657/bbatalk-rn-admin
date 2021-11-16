import gql from 'graphql-tag'

// All Read
export const GET_ALL_STAFF = gql`
  query Read($gymid: String!) {
    allStaff(gymid: $gymid) {
      _id
      gymid
      special_n
      isLeave
      name
      engName
      gender
      phone
      email
      birth
      address_f
      address_l
      team
      level
      isOperation
      seniorid 
      photo
      career
      certificate
      youtubeid
      instarid
      facebookid
      homepage
      blog
      bank_n
      account_n
      account_h
      memo
      score
      regDate
    }
  }
`

// Read
export const GET_STAFF = gql`
  query Read($_id: String!) {
    findStaff(_id: $_id) {
      _id
      gymid
      special_n
      isLeave
      name
      engName
      gender
      phone
      email
      birth
      address_f
      address_l
      team
      level
      isOperation
      seniorid 
      photo
      career
      certificate
      youtubeid
      instarid
      facebookid
      homepage
      blog
      bank_n
      account_n
      account_h
      memo
      score
      regDate
    }
  }
`

// Create
export const CREATE_STAFF = gql`
  mutation Create($input: inputStaff!) {
    createStaff(input: $input) {
      _id
      gymid
      special_n
      isLeave
      name
      engName
      gender
      phone
      email
      birth
      address_f
      address_l
      team
      level
      isOperation
      seniorid 
      photo
      career
      certificate
      youtubeid
      instarid
      facebookid
      homepage
      blog
      bank_n
      account_n
      account_h
      memo
      score
      regDate
    }
  }
`

// Update
export const UPDATE_STAFF = gql`
  mutation Update($_id: String!, $input: inputStaff!) {
    updateStaff(_id: $_id, input: $input) {
      _id
      gymid
      special_n
      isLeave
      name
      engName
      gender
      phone
      email
      birth
      address_f
      address_l
      team
      level
      isOperation
      seniorid 
      photo
      career
      certificate
      youtubeid
      instarid
      facebookid
      homepage
      blog
      bank_n
      account_n
      account_h
      memo
      score
      regDate
    }
  }
`

// Delete
export const DELETE_STAFF = gql`
  mutation Delete($_id: String!) {
    deleteStaff(_id: $_id) {
      _id
    }
  }
`

// BulkDelete
export const DELETE_BULK_STAFF = gql`
  mutation Delete($idList: [String]!) {
    bulkDeleteStaff(idList: $idList)
  }
`
