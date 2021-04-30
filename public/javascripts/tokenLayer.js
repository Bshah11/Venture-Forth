/*
let srcDict = {
    "goblin" : 'images/unnamed.png'
}

let tokenLayer = new Konva.Layer({
    name: 'tokenlayer',
});

*/

// Client side values
//var tokenType = document.getElementById('token-type-button');

// EventListners
var tokenButton = document.getElementById('create-token-button');
var tokenType = document.getElementById('token-type-button');


// Functions
tokenButton.addEventListener("click", function(){createToken()});


function createToken(){
    console.log("In createToken");
    // Tool bar creation
    // New piece goes on board
    stage.off();
    var imageObj = new Image();
    imageObj.onload = function () {
        var img = new Konva.Image({
        x: 25,
        y: 25,
        image: imageObj,
        //stroke: "red",
        category: 'token',
        width: 50,
        height: 50,
        name: tokenType.value,
        });

        // add the shape to the layer
        draggable = img.draggable();
        img.draggable(true);
        console.log(img);
        tokenLayer.add(img);
        tokenLayer.batchDraw();
        sendLayer(saveLayer(tokenLayer));

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
            //saveLayer(tokenLayer);
            sendLayer(saveLayer(tokenLayer));
        })
    };
    imageObj.src = srcDict[tokenType.value];
    //console.log(stage);
}

function loadToken(token){
    stage.off();
    var imageObj = new Image();
    imageObj.onload = function () {
        var img = new Konva.Image({
        x: token.x,
        y: token.y,
        image: imageObj,
        //stroke: "red",
        category: token.category,
        width: token.width,
        height: token.height,
        name: token.name,
        });

        // add the shape to the layer
        draggable = img.draggable();
        img.draggable(true);
        console.log(img);
        tokenLayer.add(img);
        tokenLayer.batchDraw();
        //sendLayer(saveLayer(tokenLayer));

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
            //saveLayer(tokenLayer);
            sendLayer(saveLayer(tokenLayer));
        })
    };
    imageObj.src = srcDict[token.name];
    //console.log(stage);
}