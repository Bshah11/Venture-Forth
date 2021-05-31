var adventureLineButton = document.getElementById("adventure-Line");
var adventureCircleButton = document.getElementById("adventure-Circle");
var adventurePointerButton = document.getElementById("adventure-Pointer");
var adventureToolColor = document.getElementById("adventure-Line");

adventureLineButton.addEventListener("click", function(){addAventureLine()});
adventureCircleButton.addEventListener("click", function() {addAdventureCircle()});
adventurePointerButton.addEventListener("click", function() {addAdventurePointer()});

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  
function addAdventurePointer(){
    var adventurePointer;
    console.log("add Adventure Pointer");
    stage.off();
    stage.on("click", (e) => {
        console.log("create pointer")
        var pos = stage.getPointerPosition();
        console.log
        adventurePointer = new Konva.Circle({
            x: pos.x,
            y: pos.y,
            fill: document.getElementById("adventureColorDropdownMenu").value,
            radius: cellSize,
            category: "adventurePointer",
            opacity: 0.5
        })
        mapLayer.add(adventurePointer);
        mapLayer.draw();
        sendLayer(saveLayer(mapLayer));
        adventurePointer.to({opacity:0});
        //adventurePointer.destroy();
        //adventurePointer.destroy();

    })
}

function addAdventureCircle(){
    var lastCircle;
    console.log("add Adventure Circle");
    stage.off();
    stage.on("mousedown touchstart", (e) =>{
        isDrawing = true;
        var pos = stage.getPointerPosition();
        lastCircle = new Konva.Circle({
            x: pos.x,
            y: pos.y,
            radius:1,
            stroke: document.getElementById("adventureColorDropdownMenu").value,
            category: 'adventureCircle'
        })
        mapLayer.add(lastCircle);

    });

    stage.on('mouseup touchend', () =>{
        const pos = stage.getPointerPosition();
        console.log(isDrawing);
        newX = Math.abs(lastCircle.x - pos.x);
        newY = Math.abs(lastCircle.y - pos.y);
        radius = Math.sqrt(newX^2 + newY^2);
        if (radius*10 > lastCircle.radius()){
            lastCircle.radius(radius*10);
            mapLayer.batchDraw();
        }
        sendLayer(saveLayer(mapLayer));
        lastCircle.to({opacity:0});
        sleep(150);          
        lastCircle.destroy();
        //sendLayer(saveLayer(mapLayer));
    });

    stage.on('mousemove touchmove', () =>{
        if (!isDrawing) {
            return;
        };
        const pos = stage.getPointerPosition();
        //make sure line ends on grid intersection
        cirPos = lastCircle.absolutePosition();
        newX = Math.abs(cirPos.x - pos.x);
        newY = Math.abs(cirPos.y - pos.y);
        newRadius =  Math.sqrt(newX^2 + newY^2);
        if (newRadius *10 > lastCircle.radius()){
            lastCircle.radius(newRadius *10);
            mapLayer.batchDraw();
        }
        lastCircle.radius(newRadius*10);

        mapLayer.batchDraw();
        //saveLayer(mapLayer);
    
    });
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
            category: 'adventureLine',
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
        sleep(500);          
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
      category: 'adventureLine',
    });
    mapLayer.add(line);
    mapLayer.batchDraw();
    setTimeout(() => {
        line.to({opacity:0});
        setTimeout(() => {
            line.destroy()
        }, 100);
    }, 1000);
}

function loadAdventureCircle(token){
    circle = new Konva.Circle({
        x: token.x,
        y: token.y,
        radius:token.radius,
        stroke: token.stroke,
        category: 'adventureCircle'
    })
    mapLayer.add(circle);
    mapLayer.batchDraw();
    setTimeout(() => {
        circle.to({opacity:0});
        setTimeout(() => {
            circle.destroy()
        }, 100);
    }, 1000);
}


function loadAdventurePointer(token){
    var adventurePointer;
    console.log("add adventure Pointer");
    stage.off();
    adventurePointer = new Konva.Circle({
        x: token.x,
        y: token.y,
        fill: token.fill,
        radius: cellSize,
        category: "adventurePointer",
        opacity: token.opacity
    });
    mapLayer.add(adventurePointer);
    mapLayer.batchDraw();
    setTimeout(() => {
        adventurePointer.to({opacity:0});
        setTimeout(() => {
            adventurePointer.destroy()
        }, 100);
    }, 1000);
}