//create buttons to add event listeners
var imageButton = document.getElementById('controlImageButton');
var imageInput = document.getElementById('imageInput');
imageButton.addEventListener('click',function(){controlImage()});


//Depending on the innerHTML of imageButton, create or destroy image
function controlImage(){
    var controlText = imageButton.innerText;
    if(controlText == 'Load Image'){
        // var imageObj = new Image();
        // imageObj.onload = function () {
        //     var img = new Konva.Image({
        //     x: 25,
        //     y: 25,
        //     image: imageObj,
        //     //stroke: "red",
        //     category: 'token',
        //     width: 50,
        //     height: 50,
        //     name: tokenType.value,
        //     });
        var image = new Image();
        Konva.Image.fromURL(imageInput.value, function(image){
            imageLayer.add(image);
            imageLayer.draw();
        })
    }
}
