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

stage.add(mapLayer);
mapLayer.draw();

//Button event listeners
var mapType = document.getElementById('map-type-button');

// var mapButton = document.getElementById('create-map-button');
// mapButton.addEventListener("click", function(){createMapToken(mapType.value, 25,25)});

var loadMapButton = document.getElementById('load-map-button');
loadMapButton.addEventListener("click", function() {loadMapState()});

var saveMapButton = document.getElementById('save-map-button');
saveMapButton.addEventListener("click", function() {saveMapState(curMapState)});

var clearMapButton = document.getElementById('clear-map-button');
clearMapButton.addEventListener("click", function() {clearMapState(curMapState)});


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
      stroke: token.stroke,
      strokeWidth: token.strokeWidth,
      listening: 'true',
      lineJoin: 'round',
      category: 'line',
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
    console.log("LoadMaplayer");
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
            createMapLine(token)
        }
    });
    saveMapLayer(layer);
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
            console.log(curMapState);
            loadMapLayer(curMapState, mapLayer);
        })
        .catch(function (error) {
            console.log(error);
        });
        console.log("got past axios request")
}

function clearMapState() {
    console.log("inside clear state");
    var payload = {};
    curMapState = [];
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
        location.reload();
}

var isDrawing = false;
var lastLine;

//Get default values from the form selection
var formLineColor = document.getElementById("colorDropdownMenu");
var formStrokeWidth = document.getElementById("widthDropdownMenu");
//Add line drawing to map layer
function drawLine(color, width){
    console.log("in drawLine");
    //First, make sure all event listeners are removed from the stage element
    stage.off();
    // All functions reference the stage but write to the map layer
    stage.on('mousedown touchstart', (e) =>{
        console.log(isDrawing)
        isDrawing = true;
        var pos = stage.getPointerPosition();
        lastLine = new Konva.Line({
            stroke: color,
            strokeWidth: width,
            points: [((Math.round(pos.x/cellSize)) * cellSize), ((Math.round(pos.y/cellSize)) * cellSize)],
            category: 'line',
        });
        mapLayer.add(lastLine);
    });

    stage.on('mouseup touchend', () =>{
        const pos = stage.getPointerPosition();
        console.log(isDrawing)
        var newPoints = lastLine.points().concat([(Math.round(pos.x/cellSize)) * cellSize, (Math.round(pos.y/cellSize)) * cellSize]);
        lastLine.points(newPoints);
        isDrawing = false;
        mapLayer.batchDraw()
        saveMapLayer(mapLayer);
    });

    //This is to draw and snap to grid
    stage.on('mousemove touchmove', () =>{
        if (!isDrawing) {
            return;
        };
        const pos = stage.getPointerPosition();
        //make sure line ends on grid intersection
        if (lastLine.points().length = 2){
            var newPoints = lastLine.points().concat([(Math.round(pos.x/cellSize)) * cellSize, (Math.round(pos.y/cellSize)) * cellSize]);
        } else {
            newPoints = lastLine.points()[2] = (Math.round(pos.x/cellSize)) * cellSize;
            newPoints = lastLine.points()[3] = (Math.round(pos.y/cellSize)) * cellSize;
        }
        lastLine.points(newPoints);
        mapLayer.batchDraw()
        saveMapLayer(mapLayer);
    });

}
var drawLineButton = document.getElementById('draw-line-button');
drawLineButton.addEventListener("click", function() {drawLine(formLineColor.value, formStrokeWidth.value)});

function brushLine(color, width){
    console.log("in brush line");
    //First, make sure all event listeners are removed from the stage element
    stage.off();
    // All functions reference the stage but write to the map layer
    stage.on('mousedown touchstart', (e) =>{
        console.log(isDrawing)
        isDrawing = true;
        var pos = stage.getPointerPosition();
        lastLine = new Konva.Line({
            stroke: color,
            strokeWidth: width,
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
var brushLineButton = document.getElementById('brush-line-button');
brushLineButton.addEventListener("click", function() {brushLine(formLineColor.value, formStrokeWidth.value)});

////////////////////
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

//Classes to set the styling of the active tab
var activeTabClass = "nav-link active";
var inactiveTabClass = "nav-link";
function switchTabs(mapTabs, newTab){
    mapTabs.forEach(tab => {
        tab.removeAttribute("class");
    });
    mapTabs.forEach(tab =>{
        //console.log("tab.id: ", tab.id);
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

// idea for helper function from https://stackoverflow.com/questions/12274748/setting-multiple-attributes-for-an-element-at-once-with-javascript
function setAttributes(el, id, attrs){
    el.setAttribute('id', id);
    for(var key in attrs){
        el.setAttribute(key, attrs[key]);
    }
}

// var dropdownAttrs = {"class":"btn btn-secondary dropdown-toggle mr-2 mb-2", "type":"button", "data-toggle":"dropdown",
//                     "aria-haspopup":"true","aria-expanded":"false"}
// function displayLineOptions(){
//     colors = {"Red":"#DC2626","Green":"#047857","Blue":"#2563EB","Purple":"#7C3AED",
//               "Pink":"#DB2777","Green":"#34D399","Yellow":"#F59E0B",
//               "Indigo":"#6366F1","Black":"#111827"}
//     widths = {"Largest": 5, "Large": 4, "Medium": 3, "Small": 2, "Smallest": 1}
//     //drawOptions = {"Line tool": drawLine(curColor), "Free Draw": brushLine(curColor)};
//     var parent = document.getElementById('map-btn-toolbar');
//     //THis is what all of the dropdowns will evenutally attach too.
//     var optionsRow = document.createElement('div');
//     optionsRow.setAttribute("class", "row");
//     /////////////////////////////
//     //Create the color dropdown//
//     /////////////////////////////
//     var colorDropdownParent = document.createElement('div');
//     colorDropdownParent.setAttribute('class', 'col-4');
//     var colorDropdownDiv = document.createElement('div');
//     colorDropdownDiv.setAttribute('class', 'btn-toolbar');
//     var colorDropdownButton = document.createElement('button');
//     setAttributes(colorDropdownButton, "colorDropdownbutton", dropdownAttrs);
//     colorDropdownButton.innerHTML= "Color";
//     var colorDropdownMenu = document.createElement('div');
//     setAttributes(colorDropdownMenu, "colorDropdownMenu", {"class":"dropdown-menu"});
//     let selectedColor = '';
//     for (var key in colors){
//         let curColor = colors[key];
//         var colorChoice = document.createElement('a');
//         setAttributes(colorChoice, curColor, {"class":"dropdown-item", "href":"#"});
//         colorChoice.style.backgroundColor = curColor;
//         colorChoice.innerHTML = key;
//         colorChoice.addEventListener("click",(function(){
//             selectedColor = curColor;
//             console.log(selectedColor);
//             drawLine(selectedColor);
//         }));
//         colorDropdownMenu.appendChild(colorChoice);
//     };
//     console.log(selectedColor);
//     colorDropdownButton.appendChild(colorDropdownMenu);
//     colorDropdownDiv.appendChild(colorDropdownButton);
//     colorDropdownParent.appendChild(colorDropdownDiv);
//     optionsRow.appendChild(colorDropdownParent);
//     parent.appendChild(optionsRow);
//     /////////////////////////////
//     //Create the width dropdown//
//     /////////////////////////////
//     var widthDropdownParent = document.createElement('div');
//     widthDropdownParent.setAttribute('class', 'col-4');
//     var widthDropdownDiv = document.createElement('div');
//     widthDropdownDiv.setAttribute('class', 'btn-toolbar');
//     var widthDropdownButton = document.createElement('button');
//     setAttributes(widthDropdownButton, "widthDropdownbutton", dropdownAttrs);
//     widthDropdownButton.innerHTML = "Width";
//     var widthDropdownMenu = document.createElement('div');
//     setAttributes(widthDropdownMenu, "widthDropdownMenu", { "class": "dropdown-menu", "aria-labelledby": "widthDropdownButton" });
//     for (var key in widths) {
//         let curWidth = widths[key];
//         var widthChoice = document.createElement('a');
//         setAttributes(widthChoice, curWidth, { "class": "dropdown-item", "href": "#" });
//         widthChoice.style.backgroundColor = curWidth;
//         widthChoice.innerHTML = key;
//         //widthChoice.addEventListener("click", function () { drawLine(curColor) });
//         widthDropdownMenu.appendChild(widthChoice);
//     };
//     widthDropdownButton.appendChild(widthDropdownMenu);
//     widthDropdownDiv.appendChild(widthDropdownButton);
//     widthDropdownParent.appendChild(widthDropdownDiv);
//     optionsRow.appendChild(widthDropdownParent);
//     parent.appendChild(optionsRow);
// }
