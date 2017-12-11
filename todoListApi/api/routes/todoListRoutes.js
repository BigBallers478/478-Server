'use strict';
const AuthenticationController = require('../controllers/authentication');
const UserController = require('../controllers/userController');
const ChatController = require('../controllers/chatController');
const express = require('express');
const passport = require('passport');

const passportService = require('../config/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app) {
  const apiRoutes = express.Router(), //this initializes all the route groups
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    chatRoutes = express.Router();

//Authorization routes
  apiRoutes.use('/auth', authRoutes); //sets authorization routes as middleware to apiRoutes
  authRoutes.post('/register', AuthenticationController.register); //route to register as a new user`
  authRoutes.post('/login', requireLogin, AuthenticationController.login); //route to login
//Chat routes
  apiRoutes.use('/chat', chatRoutes); //sets chat routes as middleware to apiRoutes
  chatRoutes.get('/', requireAuth, ChatController.getChats);
  chatRoutes.get('/:chatId', requireAuth, ChatController.getChat); //gets a single chat
  chatRoutes.post('/:chatId', requireAuth, ChatController.sendMessage); //send a message in chat
  chatRoutes.post('/new/:recipient', requireAuth, ChatController.newChat);

app.use('/api', apiRoutes);

};
