exports = module.exports = function (io) {
  //This will set socket.io listeners
  io.on('connection', (socket) => {
    socket.on('join chat', (chat) => {
      socket.join(chat);
    });

    socket.on('exit chat', (chat) => {
      socket.leave(chat);
    });

    socket.on('new message', (chat) => {
      io.sockets.in(chat).emit('refresh messages', chat);
    });

    socket.on('disconnect', () => {
    });
  });
};
