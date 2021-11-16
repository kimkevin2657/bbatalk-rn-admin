'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authKeySchema = new Schema({
  email: String,
  key: String,
  expire: {
    type: Date
  }
});

authKeySchema.index({expire:1}, {expireAfterSeconds:600}) // TTL = 10분

module.exports = mongoose.model('AuthKey', authKeySchema);