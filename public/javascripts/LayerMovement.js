// // This page contains the client side setup and the socket delivery to the server
// var socket = io();

const socket = io({autoConnect: false});

socket.onAny((event, ...args) =>{
    console.log(event,args);
});

socket.on("session", ({sessionID, userID, username}) =>{
    //attach the session ID to the next reconnection
    socket.auth = { sessionID };
    console.log("session ID in browser: "+sessionID);
    //Store it
    localStorage.setItem("sesionID", sessionID);
    //Save user ID
    socket.userID = userID;
    socket.username = username;
});

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
        var tr = new Konva.Transformer();
        mapLayer.add(tr);
        mapLayer.draw();
    }
    if (payload.layerName == "opacityLayer"){
        console.log("destroy opacityLayer");
        opacityLayer.destroyChildren();
        var trO = new Konva.Transformer();
        opacityLayer.add(trO);
        opacityLayer.draw();
    }
    if (payload.layerName == "overlayImageLayer"){
        console.log("destroy imageLayer");
        overlayImageLayer.destroyChildren();
        overlayImageLayer.draw();
    }
    if (payload.layerName == "backgroundImageLayer"){
        console.log("destroy imageLayer");
        backgroundImageLayer.destroyChildren();
        backgroundImageLayer.draw();
    }

    // readd tranformers

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
            if (window.location.pathname != "/dm"){
                token.draggable = false;
            }
            loadRect(token);
        }
        if (token.category == "cir"){
            console.log("lets create a cir");            
            if (window.location.pathname != "/dm"){
                token.draggable = false;
            }
            loadCir(token);
        }
        if (token.category == "tri"){
            console.log("lets create a tri");
            if (window.location.pathname != "/dm"){
                token.draggable = false;
            }
            loadTri(token);
        }
        if (token.category == "opacity"){
            console.log("lets create a opacity");
            console.log(token);
            if (window.location.pathname != "/dm"){
                token.draggable = false;
                token.opacity = 1;
            }
            console.log(token);
            loadOpacity(token);
        }
        if(token.category == "image"){
            console.log(token);
            console.log("loading image");
            loadImage(token, payload.layerName);
        }
    });
};

socket.on('retrieveLayer', function(payload) {
    loadLayer(payload);
  });