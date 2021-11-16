'use strict'

const OptionModel = require('../models/optionSchema')
// const logger = require('../libs/logger')

async function findOption(query) {
  try {
    const data = await OptionModel.find(query)
      .sort({
        create_t: -1
      }).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function findOneOption(query) {
  try {
    const data = await OptionModel.findOne(query).lean()
    return data
  } catch (e) {
    throw e
  }
}

async function addOption(data) {
  let option = new OptionModel(data)
  try {
    await option.save()
  } catch (e) {
    throw e
  }

  return option
}

async function updateOption(query, set) {
  try {
    let option = await OptionModel.findOneAndUpdate(query, set).lean()
    return option
  } catch (e) {
    throw e
  }
}

function deleteOption(query) {
  return new Promise((resolve, reject) => {
    OptionModel.findOneAndRemove(query, (err, dom) => {
      if (err) return reject(err)
      resolve(dom)
    })
  })

}

module.exports = {
  findOption,
  findOneOption,
  addOption,
  updateOption,
  deleteOption
}