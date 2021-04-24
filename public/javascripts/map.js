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

function createMapLine(color, token){
    var line = new Konva.Line({
      points: token.points,
      stroke: color,
      strokeWidth: 3,
      listening: 'true',
      lineJoin: 'round',
      catgeory: 'line',
    });
    mapLayer.add(line);
    mapLayer.batchDraw();
}

function saveMapLayer(layer){
    curMapState = [];
    let tokens = layer.getChildren();
    tokens.each(function(token, n){
        curMapState.push(token.attrs);
    })
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
            createMapLine(token.stroke, token)
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
console.log("lineTab: ", lineTab)
lineTab.addEventListener("click",function(){switchTabs(mapTabs,lineTab)});
var shapeTab = document.getElementById('shape-tab-button');
shapeTab.addEventListener("click",function(){switchTabs(mapTabs,shapeTab)});
var enviroTab = document.getElementById('environment-tab-button');
enviroTab.addEventListener("click",function(){switchTabs(mapTabs,enviroTab)});
var mapTabs = [lineTab, shapeTab, enviroTab];

// idea for helper function from https://stackoverflow.com/questions/12274748/setting-multiple-attributes-for-an-element-at-once-with-javascript
function setAttributes(el, attrs){
    for(var key in attrs){
        el.setAttribute(key, attrs[key]);
    }
}


//Tab display functions
function displayLineOptions(){
    colors = {"bg-red-600":"#DC2626","bg-green-700":"#047857","bg-blue-600":"#2563EB","bg-purple-600":"#7C3AED",
              "bg-pink-600":"#DB2777","bg-green-400":"#34D399","bg-yellow-500":"#F59E0B",
              "bg-indigo-500":"#6366F1","bg-gray-900":"#111827"}
    var parent = document.getElementById('map-toolbar-options');
    var optionsGrid = document.createElement('div');
    optionsGrid.setAttribute("class", "grid grid-cols-2 gap-4 border-l");
    var lineStrokeCol = document.createElement('div');
    setAttributes(lineStrokeCol, {"class": "col-span-1 border-4 border-black h-full"});
    var colorGrid = document.createElement('div');
    setAttributes(colorGrid, {"class": "grid grid-flow-col auto-cols-max grid-flow-row auto-rows-max"});
    for (var key in colors){
        var colorDiv = document.createElement('div');
        colorDiv.setAttribute("class", "col-span-1");
        var colorChoice = document.createElement('button');
        setAttributes(colorChoice, {"class":"py-2 px-4"+ key + "text-white font-semibold rounded-lg shadow-md focus:outline-none", "href": "#", "textContext": key, "value": colors[key]});
        colorChoice.addEventListener("click", function(){drawLine(colors[key])});
        colorDiv.appendChild(colorChoice)
        colorGrid.appendChild(colorDiv);
    }


    lineStrokeCol.appendChild(colorGrid);
    var lineStrokeWidthCol = document.createElement('div');
    setAttributes(lineStrokeWidthCol, {"class": "col-span-1 border-4 border-black h-full"});

    optionsGrid.appendChild(lineStrokeCol);
    optionsGrid.appendChild(lineStrokeWidthCol);
    parent.appendChild(optionsGrid);

}

//Classes to set the styling of the active tab
var activeTabClass = "bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-dark font-semibold";
var inactiveTabClass = "bg-white inline-block py-2 px-4 text-blue hover:text-blue-darker font-semibold";
function switchTabs(mapTabs, newTab){
    mapTabs.forEach(tab => {
        tab.removeAttribute("class");
    });
    mapTabs.forEach(tab =>{
        console.log("tab.id: ", tab.id);
        if (tab.id == newTab.id){
            newTab.setAttribute("class", activeTabClass);
            if (newTab.id == lineTab.id){
                displayLineOptions();
            }
        } else{
            tab.setAttribute("class", inactiveTabClass);
        }
    });
};



