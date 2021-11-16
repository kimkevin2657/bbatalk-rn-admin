'use strict';
/**
 * scheduler
 * 정해진 시간에 동작해야하는 로직은 이곳에서 처리
 */
const scheduler = require('node-schedule');
const logger = require('./logger');

let isActive = false; // schedule
let sc = void 0;
function startScheduler () {
  logger.info('Start scheduler');
  // 매 분 20초 마다 발동
  // sc = scheduler.scheduleJob('20 * * * * *', function () {
  //   if (isActive) return

  //  Todo

  //   isActive = false;
  // })
}

function endScheduler () {
  logger.info('End scheduler');
  if (_.isFunction(best)) {
    // sc.cancel();  스케줄 종료
  }
}

module.exports = {
  startScheduler: startScheduler,
  endScheduler: endScheduler
}