/*
Front element for eventlisteners
    <button id="create-circle">Create circle top layer</button>
    <button id="create-square">Create square bottom layer</button>
    <button id="create-image"> Create image </button>
    <button id="save">Save</button>
    <button id="load">Load</button>

*/
//const axios = require('axios')

var circleButton = document.getElementById('create-circle');
circleButton.addEventListener("click", createButton);

var imageButton = document.getElementById('create-image');
imageButton.addEventListener("click", createImage);

function createImage(){
  console.log("create image");
  var imageObj = new Image();
  imageObj.onload = function () {
    var img = new Konva.Image({
      x: 50,
      y: 50,
      image: imageObj,
      width: 106,
      height: 118,
      id: "test",
    });

    // add the shape to the layer
    draggable = img.draggable();
    img.draggable(true);
    layer.add(img);
    layer.batchDraw();
  };
  imageObj.src = 'images/unnamed.png';
}

function createButton(){
  console.log("inside create Button");
  var newCircle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 70,
    fill: 'blue',
    stroke: 'black',
    strokeWidth: 4,
  });
  draggable = newCircle.draggable();
  newCircle.draggable(true);
  bgLayer.add(newCircle);
  bgLayer.draw();

}

var load = document.getElementById('load');
load.addEventListener("click", loadLayer);
var save = document.getElementById('save');
save.addEventListener("click", saveLayer);

function saveLayer(e){
  e.stopPropagation();
  console.log("inside Save layer");
  console.log(stage.toJSON());
  /*var payload = {};
  payload.stage = stage.toJSON();
  console.log(payload);
  */
 const headers = {'Content-Type': 'application/json'};
  axios.post('/saveStage', {
    headers: headers,
    payload: stage.toJSON()
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

function loadLayer(e){
  e.stopPropagation();
  /*var payload = {};
  payload.stage = stage.toJSON();
  console.log(payload);
  */
  axios.post('/loadStage', {})
    .then(function(response){
      console.log("Load Map");
      //console.log(response.data.map);
      var newMap = response.data.map

      var stage = Konva.Node.create(newMap, 'container');

      //newStage.create(response.data[0].map);


    })
    .catch(function (error) {
      console.log(error);
    });
    console.log("got past axios request")

}

// first we need to create a stage
var stage = new Konva.Stage({
  container: 'container',   // id of container <div>
  width: 500,
  height: 500
});

/* get draggable flag
var draggable = node.draggable();

enable drag and drop
node.draggable(true);

disable drag and drop
node.draggable(false); */

// then create layer
var layer = new Konva.Layer({
  name: 'tokenLayer'
});
var bgLayer = new Konva.Layer();

// create our shape
var circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4,

});

var draggable = circle.draggable();
circle.draggable(true);

//Function to create new line given set of points
//Lines are all active for event listeners.
function createLine(points){
  var line = new Konva.Line({
    points: points,
    stroke: 'black',
    listening: 'true',
    lineJoin: 'round',
  });
  console.log(line);
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
  curY = 500;
  for(i=0; i <= 25; i++){
    //Reset x axis to 0 to begin on left of grid again
    curX = 0;
    for(j=0; j <= 25; j++){
      //make horizontal line first
      var horizLine = createLine([curX, curY, curX+20, curY]);
      // Add line to layer
      gridLayer.add(horizLine);
      //Make vertical line
      var vertLine = createLine([curX,curY,curX,curY-20]);
      //Add line to layer
      gridLayer.add(vertLine);
      curX = curX + 20;
    }
    curY = curY - 20;
  }
  return gridLayer;
}

var gridLayer = createGrid();

// var horizontal = createLine([0,20,20,20]);
// layer.add(horizontal);
// var vertical = createLine([500,0,480,0])
// layer.add(vertical);


// //add the shape to the layer
// layer.add(circle);

// add the layer to the stage
stage.add(gridLayer);
stage.add(layer);
stage.add(bgLayer);

// draw the image
gridLayer.draw();
layer.draw();
bgLayer.draw();