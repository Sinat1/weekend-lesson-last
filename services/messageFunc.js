const Message = require("../models/message");

async function findAllMessages() {
  return await Message.find({}).limit(10);
}

async function createMessage(data) {
  return await Message.create(data);
}

module.exports = {
  findAllMessages,
  createMessage,
};
