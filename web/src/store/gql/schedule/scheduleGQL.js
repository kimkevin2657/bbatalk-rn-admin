import gql from 'graphql-tag'

// ALl Read
export const GET_ALL_SCHEDULE = gql`
  query Read($gymid: String!, $date: String, $staffid: String, $lte: String, $gte: String) {
    allSchedule(gymid: $gymid, date: $date, staffid: $staffid, lte: $lte, gte: $gte) {
      _id
      staffid
      gymid
      type
      date
      time
      stime
      etime
      duration
      sessionid
      session {
        _id
        name
        peopleCnt
      }
      room {
        _id
        name
        team
      }
      roomid
      members {
        _id
        mName
        mSpecial_n
        mPhoto
        mGender
        state
        totCnt
        useCnt
      }
      content
      create_d
    }
  }
`

export const GET_SCHEDULE = gql`
  query Read($_id: String!) {
    findSchedule(_id: $_id) {
      _id
      staffid
      gymid
      type
      date
      time
      stime
      etime
      duration
      sessionid
      session {
        _id
        name
        peopleCnt
      }
      room {
        _id
        name
        team
      }
      roomid
      members {
        _id
        mName
        mSpecial_n
        mPhoto
        mGender
        state
        totCnt
        useCnt
      }
      content
      create_d
    }
  }
`

export const CREATE_SCHEDULE = gql`
  mutation Create($input: inputSchedule!) {
    createSchedule(input: $input) {
      _id
      staffid
      gymid
      type
      date
      time
      stime
      etime
      duration
      sessionid
      session {
        _id
        name
        peopleCnt
      }
      room {
        _id
        name
        team
      }
      roomid
      members {
        _id
        mName
        mSpecial_n
        mPhoto
        mGender
        state
        totCnt
        useCnt
      }
      content
      create_d
    }
  }
`

export const UPDATE_SCHEDULE = gql`
  mutation Update($_id: String!, $input: inputSchedule!) {
    updateSchedule(_id: $_id, input: $input) {
      _id
      staffid
      gymid
      type
      date
      time
      stime
      etime
      duration
      sessionid
      session {
        _id
        name
        peopleCnt
      }
      room {
        _id
        name
        team
      }
      roomid
      members {
        _id
        mName
        mSpecial_n
        mPhoto
        mGender
        state
        totCnt
        useCnt
      }
      content
      create_d
    }
  }
`

export const DELETE_SCHEDULE = gql`
  mutation Delete($_id: String!) {
    deleteSchedule(_id: $_id) {
      _id
      staffid
      gymid
      type
      date
      time
      stime
      etime
      duration
      roomid
      content
      create_d
    }
  }
`
