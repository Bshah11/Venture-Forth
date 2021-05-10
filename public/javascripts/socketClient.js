const ioClient = require('socket.io-client');
const socket = ioClient({autoConnect: false});

socket.onAny((event, ...args) =>{
    console.log(event,args);
});

socket.on("session", ({sessionID, userID}) =>{
    //attach the session ID to the next reconnection
    socket.auth = { sessionID };
    //Store it
    localStorage.setItem("sesionID", sessionID);
    //Save user ID
    socket.userID = userID;
})

export default socket;