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
// end of socket.io logic

module.exports = socketapi;