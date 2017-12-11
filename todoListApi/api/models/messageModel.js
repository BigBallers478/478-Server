const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const MessageSchema = new Schema({ //This defines how the messages will be stored in mongoDB
  chatId: { //Each message requires a chat id
    type: Schema.Types.ObjectId,
    required: true
  },
  body: { //Each message requires string text
    type: String,
    required: true
  },
  user: { //Each message will include the user to sent it
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
  {
    timestamps: true //This will save the times that the message is created
  });

module.exports = mongoose.model('Message', MessageSchema);

