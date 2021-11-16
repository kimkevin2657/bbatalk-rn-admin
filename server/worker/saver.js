'use-strict'
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const compressing = require('compressing')
const schedule = require('node-schedule')
const moment = require('moment')

const targetDirPath = path.join(__dirname, 'data')
const resultDirPath = path.join(__dirname, 'backup')

~function () {
  // DB 백업 스케줄러, 새벽 1시마다 동작, 백업 파일은 7개 이상일 때에 가장 오래된 파일을 제거
  // (초, 분, 시, 일, 월, 년)
  console.log('Backup Scheduler...')
  schedule.scheduleJob('0 0 * * * *', async function () {
    console.log('Backup Start!')
    const t = moment()
    const fileName = `${t.format('YYYYMMDDHH')}.tar`
    const filePath = path.join(resultDirPath, fileName)
    try {
      await compressing.tar.compressDir(targetDirPath, filePath)
      console.log(`Backup Success! (name: ${fileName})`)
    } catch (e) {
      console.log(`Backup error! (name: ${fileName}): `, e)
    }
    const files = await fs.promises.readdir(resultDirPath)
    const soltedList = files.sort()
    if (_.size(soltedList) > 7) {
      const delPath = path.join(resultDirPath, files[0])
      fs.promises.unlink(delPath)
      console.log(`Delete Success (name: ${files[0]})`)
    }
  })
}()
