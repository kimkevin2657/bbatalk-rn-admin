import gql from 'graphql-tag'

export const GET_CARD = gql`
  query Setting {
    findSetting {
      card
    }
  }
`
export const GET_BANK = gql`
  query Setting {
    findSetting {
      bank
    }
  }
`
