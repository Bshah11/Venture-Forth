/*
Grid Layer
Map Layer => Shapes, Lines, some images
token Layer
Visibility Layer
*/



let dddsrcDict = {
    "goblin" : 'images/unnamed.png'
}

let tokenLayer = new Konva.Layer({
    name: 'tokenlayer',
});

stage.add(tokenLayer);
tokenLayer.draw();

var tokenType = document.getElementById('token-type-button');

var tokenButton = document.getElementById('create-token-button');
tokenButton.addEventListener("click", function(){createToken(tokenType.value, 25,25)});

var loadButton = document.getElementById('load-button');
loadButton.addEventListener("click", function() {loadState()});

var saveButton = document.getElementById('save-button');
saveButton.addEventListener("click", function() {saveState(curTokenState)});


function createToken(src, token){
    // Tool bar creation
    // New piece goes on board
    stage.off();
    var imageObj = new Image();
    imageObj.onload = function () {
        var img = new Konva.Image({
        x: token.x,
        y: token.y,
        image: imageObj,
        width: 50,
        height: 50,
        name: src,
        });
        
        // add the shape to the layer
        draggable = img.draggable();
        img.draggable(true);
        tokenLayer.add(img);
        tokenLayer.batchDraw();

        img.on('dragmove', ()=>{
            var position = img.position();
            var x = position.x;
            //console.log(x);
            var y = position.y;
            //console.log(y);
            var modX = (Math.round(x/cellSize)) * cellSize;
            var modY = (Math.round(y/cellSize)) * cellSize;
            newPosition = {x: modX, y: modY};
            img.position(newPosition);
        })
        img.on('dragend', () => {
            saveLayer(tokenLayer);
        })
    };
    imageObj.src = srcDict[src];
    console.log(stage);
}

function saveLayer(layer){
    console.log("inside saveLayer");
    curTokenState = [];
    let tokens = layer.getChildren();
    console.log(tokens);
    tokens.each(function(token, n){
        curTokenState.push(token.attrs);
    })
    console.log(curTokenState);
}

function loadLayer(curTokenState, layer){
    // Server served token creation
    layer.destroyChildren();
    curTokenState.curTokenState.forEach(token => createToken(token.name, token));

}

function saveState(curTokenState){
    console.log("inside Save state");
    var payload = {};
    payload.curTokenState = curTokenState;
    console.log(payload);
    const headers = {'Content-Type': 'application/json'};
        axios.post('/tokenState', {
        headers: headers,
        payload: payload
        })
        .then(function(response){
            console.log("saved Map");
            console.log(response.data[0]);
        })
        .catch(function (error) {
            console.log(error);
        });
        console.log("got past axios request")
}
function loadState(){
    const headers = {'Content-Type': 'application/json'};
        axios({
            method: 'get',
            url:'/tokenState',
            responseType: 'json'
        })
        .then(function(response){
            console.log("Load token");
            console.log(response.data.curTokenState);
            curTokenState = response.data.curTokenState;
            loadLayer(curTokenState, tokenLayer);
        })
        .catch(function (error) {
            console.log(error);
        });
        console.log("got past axios request")
  }
