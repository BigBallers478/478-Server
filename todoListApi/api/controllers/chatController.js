'use strict'

const Chat = require('../models/chatModel'),
      Message = require('../models/messageModel'),
      User = require('../models/userModel');

exports.getChats = function(req, res, next) {
  Chat.find({ participants: req.user._id })
    .select('_id')
    .exec(function(err, chats) {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      if(chats.length === 0){
        return res.status(200).json({message:"No chatrooms open"});
      }
      const fullChats = [];
      chats.forEach(function(chat) {
        Message.find({ chatId: chat._id })
            .sort('-createdAt')
            .limit(1)
            .populate({
                path: 'user',
                select: 'name'
            })
          .exec(function(err, message) {
            if (err) {
              res.send({ error: err });
              return next(err);
            }
            fullChats.push(message);
            if(fullChats.length === chats.length) {
              return res.status(200).json({ chats: fullChats });
            }
          });
       });
    });
}

exports.getChat = function(req, res, next) {
  Message.find({ chatId: req.params.chatId })
    .select('createdAt body user') //selects the parameters of the message
    .sort('-createdAt') //sorts the messages by the times they were sent
    .populate({
      path: 'user',
      select: 'name'
    })
    .exec(function(err, messages) {
      if (err) {
        res.send({
          error: err
        });
        return next(err);
      }
      res.status(200).json({ chat: messages });
    });
}

exports.newChat = function(req, res, next) { 
  if(!req.params.recipient) {
    res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
    return next();
  }

  if(!req.body.composedMessage) {
    res.status(422).send({ error: 'Please enter a message.' });
    return next();
  }

  const chat = new Chat({
    participants: [req.user._id, req.params.recipient]
  });

  chat.save(function(err, newChat) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    const message = new Message({
      chatId: newChat._id,
      body: req.body.composedMessage,
      user: req.user._id
    });

    message.save(function(err, newMessage) {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      res.status(200).json({ message: 'Chatroom opened!', chatId: chat._id });
      return next();
    });
  });
}

exports.sendMessage = function(req, res, next) { 
  const reply = new Message({
    chatId: req.params.chatId,
    body: req.body.composedMessage,
    user: req.user._id
  });

  reply.save(function(err, sentMessage) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    res.status(200).json({ message: 'Message sent' });
  });
};
