import gql from 'graphql-tag'

// All Read
export const GET_ALL_GYM = gql`
  query Read($mid: String) {
    allGym(mid: $mid) {
      _id
      name            # 센터 명
      mid             # 센터 소유자(관리자 계정 ID)
      stime           # 영업 시작 시간
      etime           # 영업 종료 시간
      desc            # 센터 설명
      memberRank      # 회원 등급 누적 형식(0: 없음, 1: 년 단위 누적, 2: 전체 누적)
      transferPolicy  # 양도 정책(0: 양도 불가, 1: 모두에게 양도, 2: 가족에게만 양도 가능)
      transferPee     # 양도비 설정
      accessRange     # 출입 오차 시간 (분)
      create_d
    }
  }
`

// Read
export const GET_GYM = gql`
  query Read($_id: String, $name: String) {
    findGym(_id: $_id, name: $name) {
      _id
      name            # 센터 명
      mid             # 센터 소유자(관리자 계정 ID)
      stime           # 영업 시작 시간
      etime           # 영업 종료 시간
      desc            # 센터 설명
      memberRank      # 회원 등급 누적 형식(0: 없음, 1: 년 단위 누적, 2: 전체 누적)
      transferPolicy  # 양도 정책(0: 양도 불가, 1: 모두에게 양도, 2: 가족에게만 양도 가능)
      transferPee     # 양도비 설정
      accessRange     # 출입 오차 시간 (분)
      create_d
    }
  }
`

// Update
export const UPDATE_GYM = gql`
  mutation Update($_id: String!, $input: inputGym!) {
    updateGym(_id: $_id, input: $input) {
      _id
      name            # 센터 명
      mid             # 센터 소유자(관리자 계정 ID)
      stime           # 영업 시작 시간
      etime           # 영업 종료 시간
      desc            # 센터 설명
      memberRank      # 회원 등급 누적 형식(0: 없음, 1: 년 단위 누적, 2: 전체 누적)
      transferPolicy  # 양도 정책(0: 양도 불가, 1: 모두에게 양도, 2: 가족에게만 양도 가능)
      transferPee     # 양도비 설정
      accessRange     # 출입 오차 시간 (분)
      create_d
    }
  }
`
