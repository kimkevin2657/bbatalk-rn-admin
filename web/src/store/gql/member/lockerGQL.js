import gql from 'graphql-tag'

// ALl Read
export const GET_ALL_GROUP_LOCKER = gql`
  query Read($gymid: String!) {
    allLockerGroup(gymid: $gymid) {
      _id
      name
      desc
    }
  }
`

export const GET_GROUP_LOCKER = gql`
  query Read($_id: String!) {
    findLockerGroup(_id: $_id) {
      _id
      name
      desc
    }
  }
`

export const CREATE_GROUP_LOCKER = gql`
  mutation Create($input: inputLockerGroup!) {
    createLockerGroup(input: $input) {
      _id
      name
      desc
    }
  }
`

export const UPDATE_GROUP_LOCKER = gql`
  mutation Update($_id: String!, $type: String! $input: inputLockerGroup!) {
    updateLockerGroup(_id: $_id, type: $type, input: $input) {
      _id
      name
      desc
    }
  }
`

export const DELETE_GROUP_LOCKER = gql`
  mutation Delete($_id: String!, $type: String!) {
    deleteLockerGroup(_id: $_id, type: $type) {
      _id
      name
      desc
    }
  }
`

export const DELETE_BULK_GROUP_LOCKER = gql`
  mutation Delete($type: String!, $idList: [String]!) {
    bulkDeleteLockerGroup(type: $type, idList: $idList)
  }
`
