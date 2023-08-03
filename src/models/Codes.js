const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  guildId: {
    required: true,
    type: String
  },
  code: String, 
  max: Number,
  prize: Number, 
  createdBy: String, 
  redeemedBy: [],
}); 

Schema.statics.findOrCreate = async function ({ guildId, code }) {
  const codesData = await this.findOne({ guildId, code });
  return codesData ? codesData : new this({ guildId, code });
}

module.exports = mongoose.model('Codes', Schema);