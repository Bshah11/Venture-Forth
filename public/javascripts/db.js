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
    let mapSave = {
        "map" : saveLayer(mapLayer),
        "token" : saveLayer(tokenLayer),
        "opacity": saveLayer(opacityLayer)
        };
    console.log(mapSave);
    axios.post('/map', {
        "mapName": "tester", // Map Name
        "Email" : "email@email.com",
        "map" : mapSave
        // User JWT
    })
    .then(function(response){
        console.log(response);
    })
}

function getMap(e){
    console.log("Inside get map");
    axios.get('/map/5632499082330112')
    .then(function(response){
        console.log(response.data.map);
        let getMap = response.data.map
        loadLayer(getMap.opacity);
        loadLayer(getMap.map);
        loadLayer(getMap.token);
    })
}
