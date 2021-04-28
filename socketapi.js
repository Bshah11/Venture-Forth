const io = require( "socket.io" )();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });



io.on('connection', (socket) => {
    socket.on('chat message', (payload) => {
      console.log('message: ' + payload);
      io.emit('chat message', payload);
    });
  });


// end of socket.io logic

module.exports = socketapi;