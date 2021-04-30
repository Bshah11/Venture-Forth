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
    socket.on('broadcastLayer', (payload) => {
        console.log('message: ' + payload);
        socket.broadcast.emit('retrieveLayer', payload);
    });

  });


// end of socket.io logic

module.exports = socketapi;