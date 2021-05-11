// // This page contains the client side setup and the socket delivery to the server
// var socket = io();

// const ioClient = require('socket.io-client');
const socket = io({autoConnect: false});

//Load the session and user id from local storage and connect to socket
var username = localStorage.getItem("username");
var sessionID = localStorage.getItem("sessionID");
var role = localStorage.getItem("role");
console.log("Role is: "+ role);
socket.auth = {sessionID};
socket.auth = { username };
socket.gameRole = role;
//console.log("Socket.gameRole: "+socket.gameRole);
console.log("connecting");
socket.connect();






//Event listener to reset game board by layer
var clearLayerButton = document.getElementById('clear-layer-button');
var clearLayerSelect = document.getElementById('clear-layer');

clearLayerButton.addEventListener('click', function(){clearLayer()});

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
    payload.curMapState = curMapState;
    return payload;
};

function clearLayer(){
    if (clearLayerSelect.value == 'mapLayer'){
        console.log("in clear map layer");
        var payload = {};
        payload.layerName = clearLayerSelect.value;
        var curMapState = [];
        payload.curMapState = curMapState;
        sendLayer(payload);
        mapLayer.destroyChildren();
        mapLayer.draw();
    }
    else if (clearLayerSelect.value == 'tokenLayer'){
        console.log("in clear token layer");
        var payload = {};
        payload.layerName = clearLayerSelect.value;
        var curMapState = [];
        payload.curMapState = curMapState;
        sendLayer(payload);
        tokenLayer.destroyChildren();
        tokenLayer.draw();
    }
}


//Loading from Server

function loadLayer(payload){
    // Server served token creation
    console.log("Load Layer");
    console.log(payload);
    //console.log(curMapState);
    //console.log(layer);
    console.log(payload.layerName);
    if (payload.layerName == "tokenLayer"){
        console.log("destroy tokenLayer");
        tokenLayer.destroyChildren();
        tokenLayer.draw();
    }
    if (payload.layerName == "mapLayer"){
        console.log("destroy mapLayer");
        mapLayer.destroyChildren();
        mapLayer.draw();
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
        if (token.category == "rect"){
            console.log("lets create a rect");
            token.draggable = false;
            loadRect(token);
        }
        if (token.category == "cir"){
            console.log("lets create a cir");
            token.draggable = false;
            loadCir(token);
        }
        if (token.category == "tri"){
            console.log("lets create a tri");
            token.draggable = false;
            loadTri(token);
        }
    });
};

socket.on('retrieveLayer', function(payload) {
    loadLayer(payload);
  });