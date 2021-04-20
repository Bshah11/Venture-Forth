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
        bgLayer.add(img);
        bgLayer.batchDraw();

        img.on('dragmove', ()=>{
            var position = shape.position();
            var x = position.x;
            var y = position.y;
            var modX = (Math.round(x/cellSize)) * cellSize;
            var modY = (Math.round(y/cellSize)) * cellSize;
            newPosition = {x: modX, y: modY};
            console.log("newPosition: %i", newPosition)
        })
        img.on('dragend', () => {

            saveLayer(tokenLayer);
        })
    };
    imageObj.src = srcDict[src];
}

function saveLayer(layer, state){
    curState = []; 
    let tokens = layer.getChildren();
    tokens.each( function(token, n){
      curState.push({"x": token.attrs.x, "y": token.attrs.y, "name" : token.attrs.name});
    })
}

function loadLayer(curState, layer){
    // Server served token creation
    layer.destroyChildren()
    curState.forEach(token => createToken(token.name, token.x, token.y));

}