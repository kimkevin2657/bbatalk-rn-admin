import gql from 'graphql-tag'

// All Read
export const GET_ALL_OPERATION_NOTICE = gql`
  query Read($gymid: String!) {
    allOperationNotice(gymid: $gymid) {
      _id
      num
      name
      title
      see
      create_d
    }
  }
`
// Read
export const GET_OPERATION_NOTICE = gql`
  query Read($gymid: String!, $num: Int!) {
    findOperationNotice(gymid: $gymid, num: $num) {
      _id
      gymid
      num
      name
      title
      content
      see
      create_d
      comments {
        _id
        name
        comment
      }
    }
  }
`
// Check
export const CHECK_OPERATION_NOTICE = gql`
  query Check($_id: String!, $pwd: String!) {
    checkOperationNoticePwd(_id: $_id, pwd: $pwd)
  }
`

// Create
export const CREATE_OPERATION_NOTICE = gql`
  mutation Create($input: inputOperationNotice!) {
    createOperationNotice(input: $input) {
      _id
      gymid
      num
      name
      title
      see
      create_d
    }
  }
`

// Update
export const UPDATE_OPERATION_NOTICE = gql`
  mutation Update($_id: String!, $input: inputOperationNotice!) {
    updateOperationNotice(_id: $_id, input: $input) {
      _id
      gymid
      num
      name
      title
      see
      create_d
    }
  }
`

// Delete
export const DELETE_OPERATION_NOTICE = gql`
  mutation Delete($_id: String!, $pwd: String!) {
    deleteOperationNotice(_id: $_id, pwd: $pwd) {
      _id
      gymid
      num
      name
      title
      see
      create_d
    }
  }
`
