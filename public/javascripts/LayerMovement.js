// This page contains the client side setup and the socket delivery to the server
var socket = io();



// Saving to Server
function sendLayer(layer) {
      console.log(layer);
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
    sendLayer(curMapState);
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
        if (token.category == "image"){
            createMapToken(token.name, token);
        }
        if (token.category == "line"){
            console.log("lets create a line");
            drawLine(token.color, token.width);
        }
    });
};

socket.on('retrieveLayer', function(payload) {
    var item = document.createElement('li');
    //item.textContent = payload.msg;
    //messages.appendChild(item);
    //window.scrollTo(0, document.body.scrollHeight);
    
    loadLayer(payload.layer, mapLayer);
  });