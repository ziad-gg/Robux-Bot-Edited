const mongoose = require('mongoose');
const { DEFAULT_PREFIX } = require('../Constants.js');

const Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: DEFAULT_PREFIX
  },
  group: { 
    type: Number 
  },
  recipient: {
    type: String,
  },
  price: { 
    type: Number, 
    default: 1000 
  }, 
  proofsChannel: { 
    type: String 
  },
  thxChannel: { 
    type: String 
  },
  thxEmoji: {
    type: String
  }, 
  codesChannel: { 
    type: String 
  },
  logsChannel: { 
    type: String 
  },
  clientsRole: { 
    type: String 
  },
  admins: [{
    id: String,
    commands: [String]
  }],
  buy: {
    max: { 
      type: Number, 
      default: 0 
    },
    min: { 
      type: Number, 
      default: 1 
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  transfer: {
    max: { 
      type: Number, 
      default: 0 
    },
    min: { 
      type: Number, 
      default: 1 
    },
    status: {
      type: Boolean,
      default: true
    }
  }
});

Schema.statics.get = async function (id) {
  const guildData = await this.findOne({ id });
  return guildData ? guildData : new this({ id });
}

const Guilds = mongoose.model('Guilds', Schema);

module.exports = Guilds;