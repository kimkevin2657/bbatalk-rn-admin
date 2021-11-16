exports.typeDef = `
  """
  회원이 구매하는 정보에 대하여 사전에 통계하는 형식 입니다.
  """
  type Purchase {
    gymid: String
    mid: String
    totalCnt: Int
    lessonCnt: Int
    membershipCnt: Int
    tPrice: Int
    uPrice: Int
    rPrice: Int
    yPrices: [YearPrice]
    teamList: [String]
  }
  """
  Purchase Type의 내부 데이터로 년단위 구매 정보의 형식 입니다.
  """
  type YearPrice {
    year: String
    price: Int
  }
`

exports.resolvers = {}