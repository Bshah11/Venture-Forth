
const io = require("socket.io")();
const socketapi = {
  io:io
};

function getRandID(){
  var id = Math.floor(Math.random() * 100)
  return id;
}

//Middleware taken from socket.io docs
io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  console.log("socket session ID: "+ sessionID);
  // if (sessionID) {
  //   const session = await sessionStore.findSession(sessionID);
  //   if (session) {
  //     socket.sessionID = sessionID;
  //     socket.userID = session.userID;
  //     socket.username = session.username;
  //     return next();
  //   }
  // }
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
  //Join the socket to the room
  socket.join(socket.userID);
  //Display the session information to all players connected to scoket
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  const users = [];
  for(let [id, socket] of io.of('/').sockets){
    users.push({
      userID: id,
      username: socket.username,
      //role: localStorage.getItem("role"),
    });
  }
  //Update the drop down menu that has all currently connected users
  console.log(users);
  //Emit the current list of players to all connected players
  socket.emit('get users', users);
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  console.log('user: '+socket.username+" connected");
  //Add users to array containing all users



  socket.on('disconnect', () => {
    console.log('user: '+socket.username+' disconnected');
  });
  socket.on('broadcastLayer', (payload) => {
      console.log('message: ' + payload);
      socket.broadcast.emit('retrieveLayer', payload);
  });
  socket.on('sendChat', ({payload, to})=> {
    payload.users =users;
    console.log(to);
    console.log("message in sendChat: " +payload.diceResult);
    socket.to(to).to(socket.userID).emit('sendChat',{
      payload,
      from:socket.userID,
      to,
    });
  });
  socket.on('private message', ({content, to}) =>{
    socket.to(to).to(socket.userID).emit("private message", {
      content,
      from: socket.userID,
      to,
    });
  });
});


// end of socket.io logic

module.exports = socketapi;