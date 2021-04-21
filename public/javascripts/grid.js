// Create stage object:
var gridN = 25; // Will eventually be player selected

var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: 500,
    height: 500
  });
  
var cellSize = stage.width()/gridN;


///////////////
//CREATE GRID//
///////////////

//Function to create new line given set of points
//Lines are all active for event listeners.
function createLine(points){
    var line = new Konva.Line({
      points: points,
      stroke: 'black',
      listening: 'true',
      lineJoin: 'round',
    });
    return line;
  }
  
  //Function to create grid of lines to add to layer.
  //Will move right to left adding horizontal and vertical lines to create grid.
  //Grid will be added to its own layer called gridLayer. All lines are created with createLine.
  //Currently making a 25x25 grid. Can be refactored later
  
  function createGrid(){
    console.log("in createGrid");
    var gridLayer = new Konva.Layer({
      name: 'gridLayer',
    });
    curY = stage.height();
    for(i=0; i <= gridN; i++){
      //Reset x axis to 0 to begin on left of grid again
      curX = 0;
      for(j=0; j <= gridN; j++){
        //make horizontal line first
        var horizLine = createLine([curX, curY, curX+cellSize, curY]);
        // Add line to layer
        gridLayer.add(horizLine);
        //Make vertical line
        var vertLine = createLine([curX,curY,curX,curY-cellSize]);
        //Add line to layer
        gridLayer.add(vertLine);
        curX = curX + cellSize;
      }
      curY = curY - cellSize;
    }
    return gridLayer;
  }
  
  //Fully built grid will be returned.
  var gridLayer = createGrid();

  stage.add(gridLayer);
  
  gridLayer.draw();

