//create buttons to add event listeners
var overlayImageButton = document.getElementById('overlayImageButton');
var overlayImageInput = document.getElementById('overlayImageInput');
overlayImageButton.addEventListener('click',displayImage);


//Depending on the innerHTML of overlayImageButton, create or destroy image
function displayImage(e){
    console.log("inside controlImage");
    var controlText = overlayImageButton.innerText;
    var corsAnywhere = 'https://secret-ocean-49799.herokuapp.com/'
    var url = corsAnywhere+overlayImageInput.value;
    Konva.Image.fromURL(url, function(imageNode){
        imageNode.setAttrs({
            x:0,
            y:0,
            height: 500,
            width: 500,
            url: url,
            category: 'image',
        });
        imageLayer.add(imageNode);
        imageLayer.batchDraw();
        sendLayer(saveLayer(imageLayer));
        imageNode.on('dblclick', (e) => {
            console.log("opacity dblclick");
            //trO.detach();
            e.currentTarget.destroy();
            imageLayer.draw();
            sendLayer(saveLayer(imageLayer));
        })
    });
    overlayImageInput.value = '';
};

function loadImage(image){
    console.log("loading image...")
    Konva.Image.fromURL(image.url, function(imageNode){
        imageNode.setAttrs({
            x:0,
            y:0,
            height: 500,
            width: 500,
        });
        imageLayer.add(imageNode);
        imageLayer.batchDraw();
    });
}
