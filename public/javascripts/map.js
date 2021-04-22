/*
Grid Layer
Map Layer => Shapes, Lines, some images
token Layer
Visibility Layer
*/

// curmapstate = [ { verb: "POST" url: "/MAP"}, [x,y,z]]


let mapDict = {
    "elf" : 'images/elf.jpg'
}

let mapLayer = new Konva.Layer({
    name: 'mapLayer',
});

var gridN = 25;
var cellSize = stage.width()/gridN;
stage.add(mapLayer);
mapLayer.draw();

//Button event listeners
var mapType = document.getElementById('map-type-button');

var mapButton = document.getElementById('create-map-button');
mapButton.addEventListener("click", function(){createMap(mapType.value, 25,25)});

var loadMapButton = document.getElementById('load-map-button');
loadMapButton.addEventListener("click", function() {loadMapState()});

var saveMapButton = document.getElementById('save-map-button');
saveMapButton.addEventListener("click", function() {saveMapState(curMapState)});

var drawLineButton = document.getElementById('draw-line-button');
drawLineButton.addEventListener("click", function() {drawLine()});


function createMap(src, x, y){
    console.log('Inside createMap')
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
        stroke: "red"
        });

        // add the shape to the layer
        draggable = img.draggable();
        img.draggable(true);
        mapLayer.add(img);
        mapLayer.batchDraw();

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
            saveMapLayer(mapLayer);
        })
    };
    imageObj.src = mapDict[src];
    console.log(stage);
}

function saveMapLayer(layer){
    console.log("inside saveMapLayer");
    curMapState = [];
    let tokens = layer.getChildren();
    console.log(tokens);
    tokens.each(function(token, n){
        console.log(token);
        curMapState.push({"x": token.attrs.x, "y": token.attrs.y, "name" : token.attrs.name});
    })
    console.log(curMapState);
}

function loadMapLayer(curMapState, layer){
    // Server served token creation
    layer.destroyChildren();
    console.log(curMapState.curMapState instanceof Array);
    curMapState.curMapState.forEach(token => createMap(token.name, token.x, token.y));

}

function saveMapState(curMapState){
    console.log("inside Save state");
    var payload = {};
    payload.curMapState = curMapState;
    console.log(payload);
    const headers = {'Content-Type': 'application/json'};
        axios.post('/mapState', {
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
function loadMapState(){
    const headers = {'Content-Type': 'application/json'};
        axios({
            method: 'get',
            url:'/mapState',
            responseType: 'json'
        })
        .then(function(response){
            console.log("Load Map");
            console.log(response.data.curMapState);
            curMapState = response.data.curMapState;
            loadMapLayer(curMapState, mapLayer);
        })
        .catch(function (error) {
            console.log(error);
        });
        console.log("got past axios request")
  }

var isDrawing = false;
var lastLine;
//Add line drawing to map layer
function drawLine(){
    // All functions reference the stage but write to the map layer
    stage.on('mousedown touchstart', (e) =>{
        console.log(isDrawing)
        isDrawing = true;
        var pos = stage.getPointerPosition();
        lastLine = new Konva.Line({
            stroke: 'red',
            strokeWidth: 5,
            points: [pos.x, pos.y],
        });
        mapLayer.add(lastLine);
    });

    stage.on('mouseup touchend', () =>{
        console.log(isDrawing)
        isDrawing = false;
    });

    //This is to draw and snap to grid
    stage.on('mousemove touchmove', () =>{
        if (!isDrawing) {
            return;
        };
        const pos = stage.getPointerPosition();
        //make sure line ends on grid intersection
        var newPoints = lastLine.points().concat([(Math.round(pos.x/cellSize)) * cellSize, (Math.round(pos.y/cellSize)) * cellSize]);
        lastLine.points(newPoints);
        mapLayer.batchDraw()
    });
    saveMapLayer(mapLayer);
}
