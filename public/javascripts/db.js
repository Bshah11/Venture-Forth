//Event listener to reset game board by layer
var clearLayerButton = document.getElementById('clear-layer-button');
var clearLayerSelect = document.getElementById('clear-layer');
var postMapButton = document.getElementById('post-DB');
var getMapButton = document.getElementById('get-DB');

clearLayerButton.addEventListener('click', function(){clearLayer()});
postMapButton.addEventListener('click', postMap);
getMapButton.addEventListener('click', getMap);

function postMap(e){
    console.log("Inside Post map");
    axios.post('/layers', {
        "owner": "new",
        "layer" :"test"
    })
    .then(function(response){
        console.log(response);
    })
}

function getMap(e){
    console.log("Inside get map");
    axios.get('/layers')
    .then(function(response){
        console.log(response);
    })
}
