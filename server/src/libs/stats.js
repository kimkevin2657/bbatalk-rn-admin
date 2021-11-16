const moment = require('moment')
const { split } = require('moment-range-split')
const _ = require('lodash')

// 시분할 타입
function timeSplitType (from, to) {
  const gap = moment(to).diff(from) / 1000
  let type = void 0
  if (gap <= 60) type = 'seconds'
  else if (gap <= 3600) type = 'minutes'
  else if (gap <= 86400) type = 'hours'
  else if (gap <= 2678400) type = 'days'
  else if (gap <= 80352000) type = 'months'
  else type = 'years'
  return type
}

// 시분할 카테고리
function timeSplitCategory (from, to) {
  const type = timeSplitType(from, to)
  const range = moment.range(from, to);
  const ranges = split(range, type);
  // 일자가 같을 경우 확인용
  const fromDay = moment(from).format('YYYY-MM-DD')
  const toDay = moment(to).format('YYYY-MM-DD')
  // 달이 같을 경우 확인용
  const fromMonth = moment(from).format('YYYY-MM')
  const toMonth = moment(to).format('YYYY-MM')
  // 년이 같을 경우 확인용
  const fromYear = moment(from).format('YYYY')
  const toYear = moment(to).format('YYYY')

  const category = _.map(ranges, range => {
    const t = range.start
    if (type === 'seconds') return t.format('mm분 ss초')
    if (type === 'minutes') return t.format('HH시 mm분')
    if (fromDay === toDay && type === 'hours') return t.format('HH시')
    if (type === 'hours') return t.format('DD일 HH시')
    if (fromMonth === toMonth && type === 'days') return t.format('DD일')
    if (type === 'days') return t.format('MM월 DD일')
    if (fromYear === toYear && type === 'months') return t.format('MM월')
    if (type === 'months') return t.format('YY년 MM월')
    if (type === 'years') return t.format('YYYY년')
    return t.format('YYYY-MM-DD HH:mm:ss')
  })
  return category
}

// 시분할 카테고리을 times로
function timeSplitCategoryToDateTime (from, to) {
  const type = timeSplitType(from, to)
  const range = moment.range(from, to);
  const ranges = split(range, type);

  const category = _.map(ranges, range => {
    const t = range.start
    return t.format('YYYY-MM-DD HH:mm:ss')
  })
  return category
}

// 시분할 데이터, [cnt, ...]
function timeSplitDatas (from, to, times) {
  const type = timeSplitType(from, to)
  const range = moment.range(from, to)
  const ranges = split(range, type)
  const results = []
  for (let i = 0; i < ranges.length; i++) {
    results.push(0)
  }
  _.forEach(times, time => {
    const t = moment(time)
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i]
      const isSync = t.isBetween(range.start, range.end, void 0, '[)')
      if (isSync) {
        const cnt = _.get(results, [i], 0)
        _.set(results, [i], cnt + 1)
        break
      }
    }
  })
  return results
}

// 시분할 단독 사용시: [[time, cnt]...]
function timeSplit (from, to, times = []) {
  const gap = moment(to).diff(from) / 1000
  let type = void 0
  if (gap <= 60) type = 'seconds'
  else if (gap <= 3600) type = 'minutes'
  else if (gap <= 86400) type = 'hours'
  else if (gap <= 2592000) type = 'days'
  else if (gap <= 80352000) type = 'months'
  else type = 'years'
  const range = moment.range(from, to);
  const ranges = split(range, type);
  const results = _.map(ranges, range => {
    const t = new Date(range.start)
    return [t.getTime(), 0]
  })
  _.forEach(times, time => {
    const t = moment(time)
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i]
      const isSync = t.isBetween(range.start, range.end)
      if (isSync) {
        const cnt = _.get(results, [i, 1], 0)
        _.set(results, [i, 1], cnt + 1)
        break;
      }
    }
  })
  return results
}

module.exports = {
  timeSplitType,
  timeSplitCategory,
  timeSplitCategoryToDateTime,
  timeSplitDatas,
  timeSplit
}