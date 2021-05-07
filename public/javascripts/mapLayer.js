
//Get default values from the form selection
var formLineColor = document.getElementById("colorDropdownMenu");
var formStrokeWidth = document.getElementById("widthDropdownMenu");
var mapType = document.getElementById('map-type-button');

// Lines
var drawLineButton = document.getElementById('draw-line-button');
var brushLineButton = document.getElementById('brush-line-button');

//Shapes
var newRectButton = document.getElementById('create-rect-button');
var newTriButton = document.getElementById('create-tri-button');
var newCirButton = document.getElementById('create-cir-button');


// Universal options for Map tool
var stroke = formLineColor.value;
var strokeWidth = formStrokeWidth.value;


// Tabs
var lineTabButton = document.getElementById('line-tab-button');
var shapeTabButton = document.getElementById('shape-tab-button');
var lineTab = document.getElementById("line-tab");
var shapeTab = document.getElementById("shape-tab");

// Listeners for tabs
lineTabButton.addEventListener("click", function(){
    console.log(lineTab);
    shapeTab.hidden = true;
    if (lineTab.hidden == true){
        lineTab.hidden = false;
    } else {
        lineTab.hidden = true;
    }
});

shapeTabButton.addEventListener("click", function(){
    console.log(shapeTab);
    lineTab.hidden = true;
    if (shapeTab.hidden == true){
        shapeTab.hidden = false;
    } else {
        shapeTab.hidden = true;
    }
});

//EventListener
drawLineButton.addEventListener("click", function() {drawLine()});
newRectButton.addEventListener("click", function() {drawRect()});
newTriButton.addEventListener("click", function() {drawTri()});
newCirButton.addEventListener("click", function() {drawCir()});
brushLineButton.addEventListener("click", function() {brushLine(formLineColor.value, formStrokeWidth.value)});


// Listeners for stroke and strokewidth changes
formLineColor.addEventListener("change", function(){
    stroke = formLineColor.value;
});

formStrokeWidth.addEventListener("change", function(){
    strokeWidth = formStrokeWidth.value;
});



// line drawing flag
var isDrawing = false;
var lastLine;

//shape transformer
var tr = new Konva.Transformer();
mapLayer.add(tr);


function drawRect(){
    console.log("in drawRect");
    //First, make sure all event listeners are removed from the stage element
    stage.off();
    stage.on('click', (e) =>{
        console.log("clicked");
        var pos = stage.getPointerPosition();
        let newRect = createRect(pos);
        mapLayer.add(newRect);
        mapLayer.draw();
        sendLayer(saveLayer(mapLayer));
        stage.off();
    });
};

function drawTri(){
    console.log("in drawTri");
    //First, make sure all event listeners are removed from the stage element
    stage.off();
    stage.on('click', (e) =>{
        console.log("clicked");
        var pos = stage.getPointerPosition();
        let newTri = createTri(pos);
        mapLayer.add(newTri);
        mapLayer.draw();
        sendLayer(saveLayer(mapLayer));
        stage.off();
    })
};

function drawCir(){
    console.log("in drawCir");
    //First, make sure all event listeners are removed from the stage element
    stage.off();
    stage.on('click', (e) =>{
        console.log("clicked");
        var pos = stage.getPointerPosition();
        let newCir = createCir(pos);
        mapLayer.add(newCir);
        mapLayer.draw();
        sendLayer(saveLayer(mapLayer));
        stage.off();
    })
};




function createRect(pos){
    newRect = new Konva.Rect({
        width: cellSize,
        height: cellSize,
        x: ((Math.round(pos.x/cellSize)) * cellSize),
        y: ((Math.round(pos.y/cellSize)) * cellSize),
        category: 'rect',
        fill: stroke,
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        opacity: 0.25
    });

    newRect.on('click', (e)=>{
        console.log("rect clicked");
        tr.node
        console.log(e.currentTarget);
        tr.nodes([e.currentTarget]);
        console.log(tr);
        mapLayer.draw();
    });

    newRect.on('transformend', (e) =>{
        console.log("end of transform");
        tr.detach();
        mapLayer.draw();
        sendLayer(saveLayer(mapLayer));
    });

    newRect.on('dragend', (e) =>{
        sendLayer(saveLayer(mapLayer));

    });
    return newRect;
}

function createTri(pos){
    newTri = new Konva.RegularPolygon({
        width: cellSize,
        height: cellSize,
        x: ((Math.round(pos.x/cellSize)) * cellSize),
        y: ((Math.round(pos.y/cellSize)) * cellSize),
        sides:3,
        radius: cellSize,
        category: 'tri',
        fill: stroke,
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        opacity: 0.25
    });

    newTri.on('click', (e)=>{
        console.log("rect clicked");
        tr.node
        console.log(e.currentTarget);
        tr.nodes([e.currentTarget]);
        console.log(tr);
        mapLayer.draw();
    });

    newTri.on('transformend', (e) =>{
        console.log("end of transform");
        tr.detach();
        mapLayer.draw();
        sendLayer(saveLayer(mapLayer));
    });

    newTri.on('dragend', (e) =>{
        sendLayer(saveLayer(mapLayer));

    });
    return newTri;
}


function createCir(pos){
    newCir = new Konva.Circle({
        width: cellSize,
        height: cellSize,
        x: ((Math.round(pos.x/cellSize)) * cellSize),
        y: ((Math.round(pos.y/cellSize)) * cellSize),
        category: 'cir',
        fill: stroke,
        radius: cellSize,
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        opacity: 0.25
    });

    newCir.on('click', (e)=>{
        console.log("rect clicked");
        tr.node
        console.log(e.currentTarget);
        tr.nodes([e.currentTarget]);
        console.log(tr);
        mapLayer.draw();
    });

    newCir.on('transformend', (e) =>{
        console.log("end of transform");
        tr.detach();
        mapLayer.draw();
        sendLayer(saveLayer(mapLayer));
    });

    newCir.on('dragend', (e) =>{
        sendLayer(saveLayer(mapLayer));

    });
    return newCir;
}

function loadRect(token){
    loadedRect = new Konva.Rect(token);
    //loadedRect.opacity(1);
    mapLayer.add(loadedRect);
    mapLayer.draw();
};

function loadCir(token){
    loadedCir = new Konva.Circle(token);
    //loadedRect.opacity(1);
    mapLayer.add(loadedCir);
    mapLayer.draw();
};

function loadTri(token){
    loadedTri = new Konva.RegularPolygon(token);
    //loadedRect.opacity(1);
    mapLayer.add(loadedTri);
    mapLayer.draw();
};

function drawLine(){
    console.log("in drawLine");
    //First, make sure all event listeners are removed from the stage element
    stage.off();
    // All functions reference the stage but write to the map layer
    stage.on('mousedown touchstart', (e) =>{
        console.log(isDrawing)
        isDrawing = true;
        var pos = stage.getPointerPosition();
        lastLine = new Konva.Line({
            stroke: stroke,
            strokeWidth: strokeWidth,
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
        sendLayer(saveLayer(mapLayer));
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
        //saveLayer(mapLayer);
    });

};

function loadMapLine(token){
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
        sendLayer(saveLayer(mapLayer));
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
}