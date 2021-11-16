import gql from 'graphql-tag'

// ALl Read
export const GET_ALL_RESERVESCHEDULE = gql`
  query Read(
    $gymid: String,
    $scheduleid: String,
    $memberid: String,
    $staffid: String
  ) {
    allReserveSchedule(
      gymid: $gymid,
      scheduleid: $scheduleid,
      memberid: $memberid,
      staffid: $staffid
    ) {
      # 식별 정보
      _id
      gymid
      scheduleid
      ticketid
      memberid
      staffid
      # 식별 정보를 통한 검색 정보
        # gym
        # schedule
        # ticket
        # member
        # staff
      # 회원정보
      mName
      mSpecial_n
      mPhoto
      mGender
      # 강사정보
      sName
      sSpecial_n
      sPhoto
      # 수강정보
      tName
      totCnt
      useCnt
      sdate
      edate
      # 예약정보
      date
      stime
      etime
      duration
      isAgree
      state # 0: 결석, 1: 예약, 2: 출석, 3: 취소
      register
      desc
      regDate
      create_d
    }
  }
`

export const GET_RESERVESCHEDULE = gql`
  query Read($_id: String!) {
    findReserveSchedule(_id: $_id) {
      # 식별 정보
      _id
      gymid
      scheduleid
      ticketid
      memberid
      staffid
      # 식별 정보를 통한 검색 정보
        # gym
        # schedule
        # ticket
        # member
        # staff
      # 회원정보
      mName
      mSpecial_n
      mPhoto
      mGender
      # 강사정보
      sName
      sSpecial_n
      sPhoto
      # 수강정보
      tName
      totCnt
      useCnt
      sdate
      edate
      # 예약정보
      date
      stime
      etime
      duration
      isAgree
      state # 0: 결석, 1: 예약, 2: 출석, 3: 취소
      register
      desc
      regDate
      create_d
    }
  }
`

export const CREATE_RESERVESCHEDULE = gql`
  mutation Create($input: inputReserveSchedule!) {
    createReserveSchedule(input: $input) {
      # 식별 정보
      _id
      gymid
      scheduleid
      ticketid
      memberid
      staffid
      # 식별 정보를 통한 검색 정보
        # gym
        # schedule
        # ticket
        # member
        # staff
      # 회원정보
      mName
      mSpecial_n
      mPhoto
      mGender
      # 강사정보
      sName
      sSpecial_n
      sPhoto
      # 수강정보
      tName
      totCnt
      useCnt
      sdate
      edate
      # 예약정보
      date
      stime
      etime
      duration
      isAgree
      state # 0: 결석, 1: 예약, 2: 출석, 3: 취소
      register
      desc
      regDate
      create_d
    }
  }
`

export const UPDATE_RESERVESCHEDULE = gql`
  mutation Update($_id: String!, $input: inputReserveSchedule!) {
    updateReserveSchedule(_id: $_id, input: $input) {
      # 식별 정보
      _id
      gymid
      scheduleid
      ticketid
      memberid
      staffid
      # 식별 정보를 통한 검색 정보
      # gym
      # schedule
      # ticket
      # member
      # staff
      # 회원정보
      mName
      mSpecial_n
      mPhoto
      mGender
      # 강사정보
      sName
      sSpecial_n
      sPhoto
      # 수강정보
      tName
      totCnt
      useCnt
      sdate
      edate
      # 예약정보
      date
      stime
      etime
      duration
      isAgree
      state # 0: 결석, 1: 예약, 2: 출석, 3: 취소
      register
      desc
      regDate
      create_d
    }
  }
`

export const DELETE_RESERVESCHEDULE = gql`
  mutation Delete($_id: String!) {
    deleteMember(_id: $_id) {
      _id
    }
  }
`

export const DELETE_BULK_RESERVESCHEDULE = gql`
  mutation Delete($idList: [String]!) {
    bulkDeleteReserveSchedule(idList: $idList)
  }
`
