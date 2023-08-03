const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  balance: { 
    type: Number, 
    default: 0 
  },
  blacklist: { 
    type: Boolean, 
    default: false 
  },
  buyedTotal: { 
    type: Number, 
    default: 0 
  },
  buyedCount: { 
    type: Number, 
    default: 0 
  },
  transactionsTotal: { 
    type: Number, 
    default: 0 
  },
  transactionsCount: { 
    type: Number, 
    default: 0 
  },
  lastTransactionsAccount: { 
    type: String 
  }
});

Schema.statics.get = async function (id) {
  const userData = await this.findOne({ id });
  return userData ? userData : new this({ id });
};

const Users = mongoose.model('Users', Schema);

module.exports = Users;