
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

//opacity
var newOpacityButton = document.getElementById('create-Opacity-button');

// Universal options for Map tool
var stroke = formLineColor.value;
var strokeWidth = formStrokeWidth.value;


// Tabs
var lineTabButton = document.getElementById('line-tab-button');
var shapeTabButton = document.getElementById('shape-tab-button');
var opacityTabButton = document.getElementById('opacity-tab-button');
var lineTab = document.getElementById("line-tab");
var shapeTab = document.getElementById("shape-tab");
var opacityTab = document.getElementById("opacity-tab");

// Listeners for tabs
lineTabButton.addEventListener("click", function(){
    console.log(lineTab);
    shapeTab.hidden = true;
    opacityTab.hidden = true;
    lineTab.hidden = false;
});

shapeTabButton.addEventListener("click", function(){
    console.log(shapeTab);
    shapeTab.hidden = false;
    opacityTab.hidden = true;
    lineTab.hidden = true;
});

opacityTabButton.addEventListener("click", function(){
    console.log(opacityTab);
    shapeTab.hidden = true;
    opacityTab.hidden = false;
    lineTab.hidden = true;
});

//EventListener
newRectButton.addEventListener("click", function() {drawRect()});
newTriButton.addEventListener("click", function() {drawTri()});
newCirButton.addEventListener("click", function() {drawCir()});

drawLineButton.addEventListener("click", function() {drawLine()});
brushLineButton.addEventListener("click", function() {brushLine(formLineColor.value, formStrokeWidth.value)});

newOpacityButton.addEventListener("click", function() {drawOpacity()});


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

var trO = new Konva.Transformer();
opacityLayer.add(trO);

function drawOpacity(){
    console.log("in draw Opacity");
    //First, make sure all event listeners are removed from the stage element
    stage.off();
    stage.on('click', (e) =>{
        console.log("clicked");
        var pos = stage.getPointerPosition();
        let newOpacity = createOpacity(pos);
        opacityLayer.add(newOpacity);
        opacityLayer.draw();
        sendLayer(saveLayer(opacityLayer));
        stage.off();
    });
};



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


function createOpacity(pos){
    newOpacity = new Konva.Rect({
        width: cellSize,
        height: cellSize,
        x: ((Math.round(pos.x/cellSize)) * cellSize),
        y: ((Math.round(pos.y/cellSize)) * cellSize),
        category: 'opacity',
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        opacity: 0.25
    });

    newOpacity.on('dblclick', (e) => {
        console.log("opacity dblclick");
        let trans = opacityLayer.findOne('Transformer');
        trans.detach();
        e.currentTarget.destroy();
        opacityLayer.draw();
        sendLayer(saveLayer(opacityLayer));

    })

    newOpacity.on('click', (e)=>{
        console.log("opacity clicked");
        console.log(e.currentTarget);
        let trans = opacityLayer.findOne('Transformer');
        trans.nodes([e.currentTarget]);
        console.log(trO);
        opacityLayer.draw();
        sendLayer(saveLayer(opacityLayer));
    });

    newOpacity.on('transformend', (e) =>{
        console.log("end of transform");
        let trans = opacityLayer.findOne('Transformer');
        trans.detach();
        opacityLayer.draw();
        sendLayer(saveLayer(opacityLayer));
    });

    newOpacity.on('dragend', (e) =>{
        sendLayer(saveLayer(opacityLayer));

    });
    return newOpacity;
}



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
        let trans = mapLayer.findOne('Transformer');
        console.log(e.currentTarget);
        trans.nodes([e.currentTarget]);
        console.log(trans);
        mapLayer.draw();
    });

    newRect.on('transformend', (e) =>{
        console.log("end of transform");
        let trans = mapLayer.findOne('Transformer');
        trans.detach();
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
        let trans = mapLayer.findOne('Transformer');
        console.log(e.currentTarget);
        trans.nodes([e.currentTarget]);
        console.log(trans);
        mapLayer.draw();
    });

    newTri.on('transformend', (e) =>{
        console.log("end of transform");
        let trans = mapLayer.findOne('Transformer');
        trans.detach();
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
        let trans = mapLayer.findOne('Transformer');
        console.log(e.currentTarget);
        trans.nodes([e.currentTarget]);
        console.log(trans);
        mapLayer.draw();
    });

    newCir.on('transformend', (e) =>{
        console.log("end of transform");
        let trans = mapLayer.findOne('Transformer');
        trans.detach();
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
    if (window.location.pathname == "/dm") {
        console.log("INSIDE DM TOKEN REBUILD")
        loadedRect.on('click', (e)=>{
            console.log("rect clicked");
            let trans = mapLayer.findOne('Transformer');
            console.log(e.currentTarget);
            trans.nodes([e.currentTarget]);
            console.log(trans);
            mapLayer.draw();
        });
    
        loadedRect.on('transformend', (e) =>{
            console.log("end of transform");
            let trans = mapLayer.findOne('Transformer');
            trans.detach();
            mapLayer.draw();
            sendLayer(saveLayer(mapLayer));
        });
    
        loadedRect.on('dragend', (e) =>{
            sendLayer(saveLayer(mapLayer));
    
        });
    }
    //loadedRect.opacity(1);
    mapLayer.add(loadedRect);
    mapLayer.draw();
};

function loadOpacity(token){
    console.log(token);
    loadedOpacity = new Konva.Rect(token);

    if (window.location.pathname == "/dm") {
        loadedOpacity.on('dblclick', (e) => {
            console.log("opacity dblclick");
            let trans = mapLayer.findOne('Transformer');
            trans.detach();
            e.currentTarget.destroy();
            opacityLayer.draw();
            sendLayer(saveLayer(opacityLayer));
    
        })
    
        loadedOpacity.on('click', (e)=>{
            console.log("opacity clicked");
            let trans = mapLayer.findOne('Transformer');
            trans.nodes([e.currentTarget]);
            console.log(trans);
            opacityLayer.draw();
            sendLayer(saveLayer(opacityLayer));
        });
    
        loadedOpacity.on('transformend', (e) =>{
            console.log("end of transform");
            let trans = mapLayer.findOne('Transformer');
            trans.detach();
            opacityLayer.draw();
            sendLayer(saveLayer(opacityLayer));
        });
    
        loadedOpacity.on('dragend', (e) =>{
            sendLayer(saveLayer(opacityLayer));
    
        });
    }
    //loadedRect.opacity(1);
    opacityLayer.add(loadedOpacity);
    opacityLayer.draw();
};


function loadCir(token){
    loadedCir = new Konva.Circle(token);
    if (window.location.pathname == "/dm") {
        loadedCir.on('click', (e)=>{
            console.log("rect clicked");
            let trans = mapLayer.findOne('Transformer');
            console.log(e.currentTarget);
            trans.nodes([e.currentTarget]);
            console.log(tr);
            mapLayer.draw();
        });
    
        loadedCir.on('transformend', (e) =>{
            console.log("end of transform");
            let trans = mapLayer.findOne('Transformer');
            trans.detach();
            mapLayer.draw();
            sendLayer(saveLayer(mapLayer));
        });
    
        loadedCir.on('dragend', (e) =>{
            sendLayer(saveLayer(mapLayer));
    
        });
    }
    //loadedRect.opacity(1);
    mapLayer.add(loadedCir);
    mapLayer.draw();
};

function loadTri(token){
    loadedTri = new Konva.RegularPolygon(token);
    if (window.location.pathname == "/dm") {
        loadedTri.on('click', (e)=>{
            console.log("rect clicked");
            let trans = mapLayer.findOne('Transformer');
            console.log(e.currentTarget);
            trans.nodes([e.currentTarget]);
            console.log(tr);
            mapLayer.draw();
        });
    
        loadedTri.on('transformend', (e) =>{
            console.log("end of transform");
            let trans = mapLayer.findOne('Transformer');
            trans.detach();
            mapLayer.draw();
            sendLayer(saveLayer(mapLayer));
        });
    
        loadedTri.on('dragend', (e) =>{
            sendLayer(saveLayer(mapLayer));
    
        });
    }
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