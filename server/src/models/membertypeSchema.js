'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const membertypeSchema = new Schema({
  
});

module.exports = mongoose.model('MemeberType', membertypeSchema);