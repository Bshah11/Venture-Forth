
const io = require("socket.io")();
const socketapi = {
  io:io
};

function getRandID(){
  var id = Math.floor(Math.random() * 100)
}
//Middleware taken from socket.io docs
io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = getRandID();
  socket.userID = getRandID();
  socket.username = username;
  next();
});

// Add your socket.io logic here!
io.on('connection', (socket) => {
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
    console.log('user: '+socket.username+" connected");
    const users = [];
    for(let [id, socket] of io.of('/').sockets){
      users.push({
        userID: id,
        username: socket.username,
      });
    }
    socket.on('disconnect', () => {
      console.log('user: '+socket.username+' disconnected');
    });
    socket.on('broadcastLayer', (payload) => {
        console.log('message: ' + payload);
        socket.broadcast.emit('retrieveLayer', payload);
    });
    socket.on('sendChat', (payload)=> {
      console.log("message in sendChat: " +payload.diceResult);
      socket.broadcast.emit('displayChat', payload);
    });

  });


// end of socket.io logic

module.exports = socketapi;