/**
 * jwt: json web token
 * jwtObj.secret 는 노출되면 안되므로 서버 세팅 후 변경해 줄 것
 */
let jwtObj = {};

jwtObj.secret = "nopepleSolo"

module.exports = jwtObj