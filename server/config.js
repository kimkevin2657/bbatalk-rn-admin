const path = require('path')

module.exports = {
  // Product 모드 설정
  graphiql: true,
  voyager: true,
  graphqldoc: true,
  // 경로
  imagesPath: path.join(__dirname, 'images')
}
