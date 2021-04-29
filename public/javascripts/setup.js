//Stage and layer setup//
var stage = new Konva.Stage({
    container: 'konva-container',   // id of container <div>
    width: 500,
    height: 500
  });

var gridLayer = new Konva.Layer({
    name: 'gridLayer',
});

var mapLayer = new Konva.Layer({
    name: 'mapLayer',
});

stage.add(mapLayer);
mapLayer.draw();

let tokenLayer = new Konva.Layer({
    name: 'tokenlayer',
});

//CONST//
const gridN = 25;
const cellSize = stage.width()/gridN;

///////////////
//CREATE GRID//
///////////////

function createLine(points){
//Function to create new line given set of points
//Lines are all active for event listeners.
    var line = new Konva.Line({
      points: points,
      stroke: 'green',
      strokeWidth: 1,
      opacity: .5,
      listening: 'true',
      lineJoin: 'round',
    });
    return line;
  }

function createGrid(layer){
// This function directly manipulates the object itself
    console.log("in createGrid");
    curY = stage.height();
    for(i=0; i <= gridN; i++){
        //Reset x axis to 0 to begin on left of grid again
        curX = 0;
        for(j=0; j <= gridN; j++){
        //make horizontal line first
            var horizLine = createLine([curX, curY, curX+cellSize, curY]);
            // Add line to layer
            layer.add(horizLine);
            //Make vertical line
            var vertLine = createLine([curX,curY,curX,curY-cellSize]);
            //Add line to layer
            layer.add(vertLine);
            curX = curX + cellSize;
        }
        curY = curY - cellSize;
        }
    return;
  }


createGrid(gridLayer); // Adds grids to Layer
stage.add(gridLayer);
gridLayer.draw();