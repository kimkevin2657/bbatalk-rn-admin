const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const config = require('../../config')

/**
 * 랜덤한 정수값을 출력
 * @param {Number} min 
 * @param {Number} max 
 */
function getRandomInt (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * 인증 관련
 */
// 인증용, salt 생성
function genSalt () {
  return crypto.randomBytes(Math.ceil(16 / 2))
    .toString('hex')
    .slice(0, 16)
}
// 암호화키 생성
function sha512 (password, salt) {
  let hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  return hash.digest('hex')
}

// 패스워크 해쉬 + salt
function saltHashPassword (password, salt) {
  if (!salt) salt = genSalt(16)
  var hashPassword = sha512(password, salt)
  return {
    hashPassword: hashPassword,
    salt: salt
  }
}

// 파일 이미지 이름을 생성
function getImageFileName (symbol, gymid, special_n, dataUrl) {
  const regex = /^data:.+\/(.+);base64,(.*)$/
  let matches = dataUrl.match(regex)
  let ext = matches[1]
  return `${gymid}${symbol}${special_n}.${ext}`
}

// image 폴더에 이미지 파일 만들어 삽입
function saveDataUrlToImage (fileName, dataUrl) {
  return new Promise((resolve, reject) => {
    const regex = /^data:.+\/(.+);base64,(.*)$/
    let matches = dataUrl.match(regex)
    let imgData = matches[2]
    let buffer = new Buffer(imgData, 'base64')
    let imagePath = path.join(config.imagesPath, fileName)
    fs.writeFile(imagePath, buffer, (err, data) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = {
  getRandomInt,
  saltHashPassword,
  getImageFileName,
  saveDataUrlToImage
}