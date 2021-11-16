'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const presetSchema = new Schema({
  memberRegPath: Array,
  memberRegType: Array,
  lessonRegPath: Array,
  lessonRegType: Array
})

module.exports = mongoose.model('Define-Preset', presetSchema);