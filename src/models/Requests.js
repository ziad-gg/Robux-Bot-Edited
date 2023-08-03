const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  groupId: {
    required: true,
    type: String
  },
  userId: String,
  requestDate: String, 
  joinDate: String, 
}); 

Schema.statics.createNewRequest = async function({ groupId, userId, requestDate, joinDate }) {
  const Request = await this.findOne({ groupId, userId });
  if (Request) await Request.updateOne({ requestDate, joinDate });
  else await this.create({ groupId, userId, requestDate, joinDate }).catch(console.error);
};

module.exports = mongoose.model('Requests', Schema);