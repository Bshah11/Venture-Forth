//create buttons to add event listeners
var imageButton = document.getElementById('controlImageButton');
var imageInput = document.getElementById('imageInput');
imageButton.addEventListener('click',controlImage);


//Depending on the innerHTML of imageButton, create or destroy image
function displayImage(e){
    console.log("inside controlImage");
    var controlText = imageButton.innerText;
    var corsAnywhere = 'https://secret-ocean-49799.herokuapp.com/'
    var url = corsAnywhere+imageInput.value;
    Konva.Image.fromURL(url, function(imageNode){
        imageNode.setAttrs({
            x:0,
            y:0,
            height: 500,
            width: 500,
            url: url,
        });
        imageLayer.add(imageNode);
        imageLayer.batchDraw();
        imageNode.on('dblclick', (e) => {
            console.log("opacity dblclick");
            //trO.detach();
            e.currentTarget.destroy();
            imageLayer.draw();
            sendLayer(saveLayer(imageLayer));
        })
    });
    imageInput.value = '';
};

function loadImage(image){
    Konva.Image.fromURL(url, function(imageNode){
        imageNode.setAttrs({
            x:0,
            y:0,
            height: 500,
            width: 500,
            url: url,
        });
        imageLayer.add(imageNode);
        imageLayer.batchDraw();
}
