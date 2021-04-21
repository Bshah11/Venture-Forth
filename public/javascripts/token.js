/*
Grid Layer
Map Layer => Shapes, Lines, some images
token Layer
Visibility Layer
*/ 

let curState = [];

let srcDict = {
    "goblin" : 'images/unnamed.png'
}

let tokenLayer = new Konva.Layer({
    name: 'tokenlayer',
});

var gridN = 25;
var cellSize = stage.width()/gridN;
stage.add(tokenLayer);
tokenLayer.draw();

var tokenType = document.getElementById('token-type-button');

var tokenButton = document.getElementById('create-token-button');
tokenButton.addEventListener("click", function(){createToken(tokenType.value, 25,25)});

var loadButton = document.getElementById('load-button');
loadButton.addEventListener("click", function() {loadLayer(curState, tokenLayer)});


function createToken(src, x, y){
    // Tool bar creation 
    // New piece goes on board
    var imageObj = new Image();
    imageObj.onload = function () {
        var img = new Konva.Image({
        x: x,
        y: y,
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
    curState = []; 
    let tokens = layer.getChildren();
    console.log(tokens);
    tokens.each(function(token, n){
        console.log(token);
        curState.push({"x": token.attrs.x, "y": token.attrs.y, "name" : token.attrs.name});
    })
    console.log(curState);
}

function loadLayer(curState, layer){
    // Server served token creation
    layer.destroyChildren()
    curState.forEach(token => createToken(token.name, token.x, token.y));

}