//create buttons to add event listeners
var overlayImageButton = document.getElementById('overlayImageButton');
var overlayImageInput = document.getElementById('overlayImageInput');
overlayImageButton.addEventListener('click',function(){displayImage(overlayImageButton.value)});

var backgroundImageButton = document.getElementById('backgroundImageButton');
var backgroundImageInput = document.getElementById('backgroundImageInput');
backgroundImageButton.addEventListener('click',function(){displayImage(backgroundImageButton.value)});


//Depending on the innerHTML of overlayImageButton, create or destroy image
function displayImage(layer){
    console.log(layer);
    var controlText = overlayImageButton.innerText;
    var corsAnywhere = 'https://secret-ocean-49799.herokuapp.com/'
    var overlayURL = corsAnywhere+overlayImageInput.value;
    var backgroundURL = corsAnywhere+backgroundImageInput.value;
    if(layer == 'overlayImageLayer'){
        overlayImageLayer.destroyChildren();
        Konva.Image.fromURL(overlayURL, function(imageNode){
            imageNode.setAttrs({
                x:0,
                y:0,
                height: 500,
                width: 500,
                url: overlayURL,
                category: 'image',
            });
            overlayImageLayer.add(imageNode);
            overlayImageLayer.batchDraw();
            sendLayer(saveLayer(overlayImageLayer));
            imageNode.on('dblclick', (e) => {
                console.log("opacity dblclick");
                //trO.detach();
                e.currentTarget.destroy();
                overlayImageLayer.draw();
                sendLayer(saveLayer(overlayImageLayer));
            })
        });
        overlayImageInput.value = '';
    };
    if(layer == 'backgroundImageLayer'){
        backgroundImageLayer.destroyChildren();
        Konva.Image.fromURL(backgroundURL, function(imageNode){
            imageNode.setAttrs({
                x:0,
                y:0,
                height: 500,
                width: 500,
                url: backgroundURL,
                category: 'image',
            });
            backgroundImageLayer.add(imageNode);
            backgroundImageLayer.batchDraw();
            sendLayer(saveLayer(backgroundImageLayer));
            imageNode.on('dblclick', (e) => {
                console.log("opacity dblclick");
                //trO.detach();
                e.currentTarget.destroy();
                backgroundImageLayer.draw();
                sendLayer(saveLayer(backgroundImageLayer));
            })
        });
        backgroundImageInput.value = '';
    };

};

function loadImage(image,layer){
    console.log("loading image...")
    Konva.Image.fromURL(image.url, function(imageNode){
        imageNode.setAttrs({
            x:0,
            y:0,
            height: 500,
            width: 500,
        });
        if(layer == 'overlayImageLayer'){
            overlayImageLayer.add(imageNode);
            overlayImageLayer.batchDraw();
        }
        if(layer == 'backgroundImageLayer'){
            backgroundImageLayer.add(imageNode);
            backgroundImageLayer.batchDraw();
        }
    });


}
