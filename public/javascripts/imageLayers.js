//create buttons to add event listeners
var overlayImageButton = document.getElementById('overlayImageButton');
var overlayImageInput = document.getElementById('overlayImageInput');
overlayImageButton.addEventListener('click',function(){displayImage(overlayImageButton.value)});

var backgroundImageButton = document.getElementById('backgroundImageButton');
var backgroundImageInput = document.getElementById('backgroundImageInput');
backgroundImageButton.addEventListener('click',function(){displayImage(backgroundImageButton.value)});

//Music choice buttons
var musicSelectDropdownValue = document.getElementById('musicChoiceDropdown');
var musicSubmitButton = document.getElementById('musicSubmitButton');
musicSubmitButton.addEventListener('click',function(){sendAudio(musicSelectDropdownValue.value)})
var audioPlayer = document.getElementById('audioPlayer');
var audioPlayerSource = document.getElementById('audioPlayerSource');


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

//Emit the DM's song choice to all connected parties
function sendAudio(music){
    console.log(music);
    console.log(musicDict[music]);
    let payload ={};
    payload.music = musicDict[music];
    socket.emit("sendMusic",payload);
    audioPlayer.src = musicDict[music];
    audioPlayer.play();
}

//Need to build a brand new audio element for the receiving end otherwise Chromium will not allow you to set the source
//Of the audio element.
socket.on('playMusic', (payload) => {
    var userAudioDiv = document.getElementById('userAudio');
    var userAudio = document.createElement('audio');
    userAudio.controls=true;
    userAudio.src = payload.music;
    userAudioDiv.appendChild(userAudio);
    userAudio.play();
});
