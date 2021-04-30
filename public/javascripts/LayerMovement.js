// This page contains the client side setup and the socket delivery to the server
var socket = io();

// Saving to Server
function sendLayer(layer) {
      //console.log(layer);
      let payload = {};
      payload.layer = layer;
      socket.emit('broadcastLayer', payload);
}

function saveLayer(layer){
// Input: Layer should be the created layer object
// Return: The list of json object that will be sent to the server
    curMapState = [];
    let tokens = layer.getChildren();
    tokens.each(function(token, n){
        curMapState.push(token.attrs);
    })
    return curMapState;
};

//Loading from Server

function loadLayer(curMapState, layer){
    // Server served token creation
    console.log("Load Layer");
    //console.log(curMapState);
    //console.log(layer);
    layer.destroyChildren();
    //console.log(layer);
    curMapState.forEach(token =>{
        //token = getAttributes(token);
        //console.log(token);
        if (token.category == "token"){
            console.log("lets create a token");
            loadToken(token);
        }
        if (token.category == "line"){
            console.log("lets create a line");
            console.log(token);
            // No need to recall draw line, we should call the konva creator directly
            loadMapLine(token);
        }
    });
};

socket.on('retrieveLayer', function(payload) {
    loadLayer(payload.layer, mapLayer);
  });