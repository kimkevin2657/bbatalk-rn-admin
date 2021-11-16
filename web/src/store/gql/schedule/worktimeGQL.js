import gql from 'graphql-tag'

// ALl Read
export const GET_ALL_WORKTIME = gql`
  query Read($gymid: String!, $date: Date, $staffid: String, $gte: String, $lte: String) {
    allWorkTime(gymid: $gymid, date: $date, staffid: $staffid, gte: $gte, lte: $lte) {
      _id
      staffid
      type
      date
      stime
      etime
    }
  }
`

export const GET_WORKTIME = gql`
  query Read($_id: String!) {
    findWorkTime(_id: $_id) {
      _id
      staffid
      type
      date
      stime
      etime
    }
  }
`

export const CREATE_WORKTIME = gql`
  mutation Create($input: inputWorkTime!) {
    createWorkTime(input: $input) {
      _id
      staffid
      type
      date
      stime
      etime
    }
  }
`

export const UPDATE_WORKTIME = gql`
  mutation Update($_id: String!, $input: inputWorkTime!) {
    updateWorkTime(_id: $_id, input: $input) {
      _id
      staffid
      type
      date
      stime
      etime
    }
  }
`

export const DELETE_WORKTIME = gql`
  mutation Delete($_id: String!) {
    deleteWorkTime(_id: $_id) {
      _id
      staffid
      type
      date
      stime
      etime
    }
  }
`
