//Stage and layer setup//
var stage = new Konva.Stage({
    container: 'konva-container',   // id of container <div>
    width: 500,
    height: 500
  });




var backgroundDict= {
  'Woodland Tower': 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ff727761-d6b1-4548-916b-3b9033c9149d/ddnawjy-9b600c2e-4619-46f6-a709-011c2485b52c.jpg/v1/fill/w_1078,h_741,q_70,strp/watchtower_in_the_hills_vtt_no_grid_by_zatnikotel_ddnawjy-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzA4MCIsInBhdGgiOiJcL2ZcL2ZmNzI3NzYxLWQ2YjEtNDU0OC05MTZiLTNiOTAzM2M5MTQ5ZFwvZGRuYXdqeS05YjYwMGMyZS00NjE5LTQ2ZjYtYTcwOS0wMTFjMjQ4NWI1MmMuanBnIiwid2lkdGgiOiI8PTQ0ODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.2WacElFwpfDZfBpzRkDVYkt89IgG7LlKmYjpCMlJCiQ'

}

var musicDict ={
  'inn': "music/255_The_Hearth_Inn.mp3",
}


//Instantiate layer objects and prepare them to be added to the stage and modified by users
var backgroundImageLayer = new Konva.Layer({
  name: 'backgroundImageLayer'
});

var gridLayer = new Konva.Layer({
    name: 'gridLayer',
});

var mapLayer = new Konva.Layer({
    name: 'mapLayer',
});

let tokenLayer = new Konva.Layer({
    name: 'tokenLayer',
});

let opacityLayer = new Konva.Layer({
  name: 'opacityLayer',
});

let overlayImageLayer = new Konva.Layer({
  name: 'overlayImageLayer',
})



//CONST//

//The grid will be a square with a gridN cells in the X and Y direction. This can be modified later to be based on user input.
const gridN = 25;
const cellSize = stage.width()/gridN;



//Image Dicts used to load the token fill images//

let srcDict = {
  "dwarf" : 'images/goblin.png',
  "elf" :'images/elf.jpg',
  "Gelatinous Cube" : 'images/jelly_cube.png',
  "goblin" : 'images/goblin1.png',
  "mimic" : 'images/mimic.png'
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

stage.add(backgroundImageLayer);
backgroundImageLayer.draw();

stage.add(gridLayer);
gridLayer.draw();

stage.add(mapLayer); //Adds map layer on top of grid layer
mapLayer.draw();

stage.add(tokenLayer); //Adds token layer on top of map layer
tokenLayer.draw();

stage.add(opacityLayer); //Adds token layer on top of map layer
opacityLayer.draw();

stage.add(overlayImageLayer);
overlayImageLayer.draw();

