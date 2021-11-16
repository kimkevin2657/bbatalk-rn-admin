const request = require('request')
const _ = require('lodash')

const apiKey = 'AIzaSyCy3SQjGNNOTY__d_MQYnoj7AGtA9StqjU'

const urlFns = {
  vedioInfo: (key) => {
    return `https://www.googleapis.com/youtube/v3/videos?id=${key}&part=snippet&key=${apiKey}`
  }
}

/**
 * 동영상키를 쿼리하여 동영상의 정보를 가져오는 API
 * @param {String} key 
 */
function vedioInfo (key) {
  return new Promise((resolve, reject) => {
    if (!key) return reject('비디오 키가 존재하지 않습니다.')
    const url = urlFns.vedioInfo(key)
    request(url, {timeout: 60*1000, json:true}, function(err, res, json){
      if(err) return reject(err);
      const tempInfo = _.get(json, ['items', 0, 'snippet'], void 0)
      if (!tempInfo) return resolve(void 0)
      const info = _.pick(tempInfo, ['title', 'description', 'channelTitle', 'publishedAt', 'tags'])
      resolve(info);
    });
  })
}

module.exports = {
  vedioInfo
}