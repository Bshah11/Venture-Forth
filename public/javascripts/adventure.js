var adventureLineButton = document.getElementById("adventure-Line");
var adventureCircleButton = document.getElementById("adventure-Circle");
var adventurePointerButton = document.getElementById("adventure-Pointer");
var adventureToolColor = document.getElementById("adventure-Line");

adventureLineButton.addEventListener("click", function(){addAventureLine()});
adventureCircleButton.addEventListener("click", function() {addAdventureCircle()});

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  

function addAventureLine(){
    console.log("add Adventure line");
    console.log(adventureToolColor.value);
    
    stage.off();
    stage.on('mousedown touchstart', (e) =>{
        console.log(isDrawing)
        isDrawing = true;
        var pos = stage.getPointerPosition();
        lastLine = new Konva.Line({
            stroke: document.getElementById("adventureColorDropdownMenu").value,
            strokeWidth: strokeWidth,
            points: [pos.x, pos.y],
            category: 'Adventureline',
            opacity: 1
        });
        mapLayer.add(lastLine);
        });
        stage.on('mouseup touchend', () =>{
            const pos = stage.getPointerPosition();
            console.log(isDrawing);
            var newPoints = lastLine.points().concat([pos.x, pos.y]);
            lastLine.points(newPoints);
            isDrawing = false;
            mapLayer.batchDraw();
            lastLine.to({opacity:0});
            sendLayer(saveLayer(mapLayer));
            sleep(150);          
            lastLine.destroy();
            //wait
    
            
            //sendLayer(saveLayer(mapLayer));
        });
            //This is to draw and snap to grid
    stage.on('mousemove touchmove', () =>{
        if (!isDrawing) {
            return;
        };
        const pos = stage.getPointerPosition();
        //make sure line ends on grid intersection
        if (lastLine.points().length = 2){
            var newPoints = lastLine.points().concat([pos.x, pos.y]);
        } else {
            newPoints = lastLine.points()[2] = pos.x;
            newPoints = lastLine.points()[3] = pos.y;
        }
        lastLine.points(newPoints);
        mapLayer.batchDraw()
        //saveLayer(mapLayer);
    
    });
}


function loadAdventureLine(token){
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
    setTimeout(() => {
        line.to({opacity:0});
        setTimeout(() => {
            line.destroy()
        }, 100);
    }, 1000);
    return line;
}
