const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ChatSchema = new Schema({ //creates new schema to store chat messages in mongoDB
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }] //gets the users who are participating in the chat room
});

module.exports = mongoose.model('Chat', ChatSchema);
