const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  _id: { type: String, required: true },
  VIP: { type: Boolean, default: false },
  Prefix: { type: String, default: '!' }
})

module.exports = model('Guild', guildSchema);