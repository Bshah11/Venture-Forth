
const io = require("socket.io")()
const socketapi = {
  io:io
};

function getRandID(){
  var id = Math.floor(Math.random() * 100)
  return id;
}



var sessionStore = [];

function findSession(sessionID){
  console.log('in findSession looking up session id: '+sessionID);
  console.log(sessionStore);
  const session = sessionStore.find(({id}) => id  === sessionID);
  console.log("session returned: "+session);
  return session;
};

function saveSession(id, userID, username, connected){
  console.log("saving session: "+id);
  console.log("saving userID: "+userID);
  console.log("saving username: "+username);
  console.log("is connected?"+connected);
  let session = {};
  session.id = id;
  session.userID = userID;
  session.username = username;
  session.connected = connected;
  sessionStore.push(session);
};

//Middleware taken from socket.io docs
io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  console.log("socket session ID: "+ sessionID);
  if (sessionID) {
    const session = await findSession(sessionID);
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
  saveSession(socket.sessionID,socket.userID,socket.username,socket.connected = true);
  console.log(sessionStore);
  //Join the socket to the room
  socket.join(socket.userID);
  //Display the session information to all players connected to scoket
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
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

  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });
  console.log('user: '+socket.username+" connected");

  //Send the users array to all players so that the dropdown is properly updated.
  //This could be done more succintly i'm sure however I could not get it to broadcast
  //To everyone on a new user connecting or have the updated player list. This ensures
  //That a new player joining the game has the most up to date player list and all players already
  //connected have their player list updated on new player connection.
  socket.emit('get users', users);
  socket.broadcast.emit('get users', users);

  socket.on('disconnect', () => {
    console.log('user: '+socket.username+' disconnected');
  });

  socket.on('broadcastLayer', (payload) => {
      console.log('message: ' + payload);
      socket.broadcast.emit('retrieveLayer', payload);
  });

  socket.on('sendRoll', (payload)=> {
    payload.users =users;
    console.log("payload "+payload)
    var to = payload.to;
    //console.log("to "+ to);
    console.log("message in sendChat: " +payload.diceResult);
    socket.to(payload.to).to(socket.userID).emit('sendRoll',{
      payload,
      from:socket.userID,
      to,
    });
  });
  socket.on('globalRoll', (payload)=>{
    console.log("globalRoll: "+payload.diceResult)
    socket.broadcast.emit("allRoll", payload);
  });

  socket.on('sendChat', (payload)=> {
    payload.users =users;
    console.log("payload "+payload)
    var to = payload.to;
    //console.log("to "+ to);
    console.log("message in sendChat: " +payload.chat);
    socket.to(payload.to).to(socket.userID).emit('sendChat',{
      payload,
      from:socket.userID,
      to,
    });
  });
  socket.on('globalChat', (payload)=>{
    console.log("globalChat: "+payload.chat)
    socket.broadcast.emit("allChat", payload);
  });
  socket.on('sendMusic',(payload)=>{
    socket.broadcast.emit("playMusic", payload);
  });

});


// end of socket.io logic

module.exports = socketapi;