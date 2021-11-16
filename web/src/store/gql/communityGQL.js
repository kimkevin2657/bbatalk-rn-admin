import gql from 'graphql-tag'

// All Read
export const GET_ALL_TUBE = gql`
  query Read {
      allTube {
      _id
      key
      title
      description
      channelTitle
      create_d
    }
  }
`
// Read
export const GET_TUBE = gql`
  query Read($_id: String!) {
    findTube(_id: $_id) {
      _id
      key
      title
      description
      channelTitle
      create_d
    }
  }
`
// Create
export const CREATE_TUBE = gql`
  mutation Create($input: inputTube!) {
    createTube(input: $input) {
      _id
      key
      title
      description
      channelTitle
      create_d
    }
  }
`

// Delete
export const DELETE_TUBE = gql`
  mutation Delete($key: String!) {
    deleteTube(key: $key) {
      _id
      key
      title
      description
      channelTitle
      create_d
    }
  }
`
