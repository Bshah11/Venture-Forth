
//Get default values from the form selection
var formLineColor = document.getElementById("colorDropdownMenu");
var formStrokeWidth = document.getElementById("widthDropdownMenu");
var mapType = document.getElementById('map-type-button');
var drawLineButton = document.getElementById('draw-line-button');
var brushLineButton = document.getElementById('brush-line-button');

var stroke = formLineColor.value;
var strokeWidth = formStrokeWidth.value;


//EventListener
drawLineButton.addEventListener("click", function() {drawLine()});
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