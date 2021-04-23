/*
Grid Layer
Map Layer => Shapes, Lines, some images
token Layer
Visibility Layer
*/

// curmapstate = [ { verb: "POST" url: "/MAP"}, [x,y,z]]


let mapDict = {
    "goblin" : 'images/elf.jpg'
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
mapButton.addEventListener("click", function(){createMapToken(mapType.value, 25,25)});

var loadMapButton = document.getElementById('load-map-button');
loadMapButton.addEventListener("click", function() {loadMapState()});

var saveMapButton = document.getElementById('save-map-button');
saveMapButton.addEventListener("click", function() {saveMapState(curMapState)});

var drawLineButton = document.getElementById('draw-line-button');
drawLineButton.addEventListener("click", function() {drawLine()});


function createMapToken(src, token){
    console.log('Inside createMapToken')
    // Tool bar creation
    // New piece goes on board
    var imageObj = new Image();
    imageObj.onload = function () {
        var img = new Konva.Image({
        x: token.x,
        y: token.y,
        image: imageObj,
        width: 50,
        height: 50,
        name: src,
        stroke: "red",
        category: "image",
        });
        //img.category = "image";
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

function createMapLine(token){
    var line = new Konva.Line({
      points: token.points,
      stroke: 'red',
      strokeWidth: 3,
      listening: 'true',
      lineJoin: 'round',
      catgeory: 'line',
    });
    mapLayer.add(line);
    mapLayer.batchDraw();
}

function saveMapLayer(layer){
    console.log("inside saveMapLayer");
    curMapState = [];
    let tokens = layer.getChildren();

    console.log(tokens);
    tokens.each(function(token, n){
        console.log("Token category: ",token.attrs.category);
        curMapState.push(token.attrs);
    })
    console.log(curMapState);
}

//Draw all map objects after receiving map state from server
function loadMapLayer(curMapState, layer){
    // Server served token creation
    layer.destroyChildren();
    curMapState.curMapState.forEach(token =>{
        //token = getAttributes(token);
        if (token.category == "image"){
            createMapToken(token.name, token);
        }
        if (token.category == "line"){
            createMapLine(token)
        }

    });

}

//This function may be needed later to pull out certain attributes.
function getAttributes(token){
    console.log("inside getAttributes");
    let attDict = {};
    console.log("token before: ", token);
    Object.keys(token).forEach(key => {
        //console.log(entry);
        token[key] = token[key];
      });
    console.log("token in getAttributes:",token)
    console.log('token.category', token.category)
    return token;
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
function drawLine(color){
    // All functions reference the stage but write to the map layer
    stage.on('mousedown touchstart', (e) =>{
        console.log(isDrawing)
        isDrawing = true;
        var pos = stage.getPointerPosition();
        lastLine = new Konva.Line({
            stroke: color,
            strokeWidth: 5,
            points: [pos.x, pos.y],
            category: 'line',
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
        saveMapLayer(mapLayer);
    });
}

/////////////////////
//Toolbar functions//
////////////////////

var lineTab = document.getElementById('line-tab-button');
lineTab.addEventListener("click", function(){displayLineOptions()});

function displayLineOptions(){
    colors = ["#ff0000","#0066ff","#33cc33"]
    colors.forEach(color =>{
        var parent = document.getElementById('card-group');
        var newCard = document.createElement('div');
        newCard.setAttribute("class", "card");
        newColor = document.createElement('div');
        newColor.setAttribute("class","card-body");
        newColor.style.backgroundColor = color;
        newColor.addEventListener("click",function(){drawLine(color)});
        newCard.appendChild(newColor);
        parent.appendChild(newCard);

    });
}