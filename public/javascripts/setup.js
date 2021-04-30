//Stage and layer setup//
var stage = new Konva.Stage({
    container: 'konva-container',   // id of container <div>
    width: 500,
    height: 500
  });

//Instantiate layer objects and prepare them to be added to the stage and modified by users
var gridLayer = new Konva.Layer({
    name: 'gridLayer',
});


var mapLayer = new Konva.Layer({
    name: 'mapLayer',
});


let tokenLayer = new Konva.Layer({
    name: 'tokenLayer',
});




//CONST//

//The grid will be a square with a gridN cells in the X and Y direction. This can be modified later to be based on user input.
const gridN = 25;
const cellSize = stage.width()/gridN;



//Image Dicts used to load the token fill images//

let srcDict = {
  "goblin" : 'images/goblin.png',
  "elf" :'images/elf.jpg'
};

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

//These functions create the correct hierarchy of the canvas to properly display the game. Modifying the order will result
// in undesireable behavior.
createGrid(gridLayer); // Adds grids to Layer
stage.add(gridLayer);
gridLayer.draw();

stage.add(mapLayer); //Adds map layer on top of grid layer
mapLayer.draw();

stage.add(tokenLayer); //Adds token layer on top of map layer
tokenLayer.draw();