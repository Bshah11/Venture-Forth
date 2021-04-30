// This page contains the client side setup and the socket delivery to the server
var socket = io();

// Saving to Server
function sendLayer(payload) {
      //console.log(layer);
      socket.emit('broadcastLayer', payload);
}

function saveLayer(layer){
// Input: Layer should be the created layer object
// Return: The list of json object that will be sent to the server
    var payload = {};
    payload.layerName = layer.attrs.name;
    var curMapState = [];
    let tokens = layer.getChildren();
    tokens.each(function(token, n){
        curMapState.push(token.attrs);
    });
    payload.curMapState =curMapState;
    return payload;
};

//Loading from Server

function loadLayer(payload){
    // Server served token creation
    console.log("Load Layer");
    //console.log(curMapState);
    //console.log(layer);
    console.log(payload.layerName);
    if (payload.layerName == "tokenLayer"){
        tokenLayer.destroyChildren();
    }
    if (payload.layerName == "mapLayer"){
        mapLayer.destroyChildren();
    }
    

    //console.log(layer);
    payload.curMapState.forEach(token =>{
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
    loadLayer(payload);
  });