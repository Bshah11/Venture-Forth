//Event listener to reset game board by layer
var clearLayerButton = document.getElementById('clear-layer-button');
var clearLayerSelect = document.getElementById('clear-layer');
var showSaveNewButton = document.getElementById('show-File-Name');
var postMapButton = document.getElementById('post-DB');
var newFileName = document.getElementById('new-MapName');

//var getMapButton = document.getElementById('get-DB');
var openMapListButton = document.getElementById("get-Map-List");
var mapListDropdown = document.getElementById('map-List');
var loadMapButton = document.getElementById('load-Map');
var saveCurMapButton = document.getElementById('save-Cur-Map');


clearLayerButton.addEventListener('click', function(){clearLayer()});
postMapButton.addEventListener('click', postMap);
//getMapButton.addEventListener('click', getMap);
openMapListButton.addEventListener('click', getMapList);
loadMapButton.addEventListener('click', loadMap);
saveCurMapButton.addEventListener('click', saveCurMap);
showSaveNewButton.addEventListener('click', showSaveNew);

//
var curID = null;
var curName = null;

// onLoad Functionality


function getMapsList(){
    axios.get('/map')
    .then(function (response){
        console.log("got maps");
        let playerMaps = {};

        console.log(response.data);
        for (let x = 0; x < response.data.length; x++){
            playerMaps[response.data[x].name] = response.data[x].id;
            var option = document.createElement("option");
            option.value = response.data[x].id;
            option.text = response.data[x].name;
            mapListDropdown.appendChild(option);
        }
    });

}
getMapsList();

function showSaveNew(e){
    newFileName.hidden = false;
    showSaveNewButton.hidden = true;
    postMapButton.hidden = false;
};

function saveCurMap(e){
    if (curID == null){
        console.log("No map to update");
        return;
    }
    let mapSave = {
        "map" : saveLayer(mapLayer),
        "token" : saveLayer(tokenLayer),
        "opacity": saveLayer(opacityLayer)
        };
    console.log(mapSave);
    axios.patch(`/map/${curID}`, {
        "name" : curName,
        "map" : mapSave
        // User JWT
    })
    .then(function(response){
        console.log("Back from Server map Patch");
        getMapsList();
    })
}


function loadMap(e){
    console.log("Inside Load Map");
    console.log(mapListDropdown.value);
    axios.get(`/map/${mapListDropdown.value}`)
    .then(function(response){
        console.log(response.data.map);
        let getMap = response.data.map
        loadLayer(getMap.opacity);
        loadLayer(getMap.map);
        loadLayer(getMap.token);
        sendLayer(getMap.opacity);
        sendLayer(getMap.map);
        sendLayer(getMap.token);
        console.log(response.data);
        curID = response.data.id;
        curName = response.data.name;
        mapListDropdown.hidden = true;
        loadMapButton.hidden = true;
        openMapListButton.hidden = false;
        saveCurMapButton.hidden = false;
    })
}

function postMap(e){
    console.log("Inside Post map");
    let mapNewName = newFileName.value;
    console.log(mapNewName);
    if (mapNewName === ""){
        console.log("Is empty");
        return;
    }
    let mapSave = {
        "map" : saveLayer(mapLayer),
        "token" : saveLayer(tokenLayer),
        "opacity": saveLayer(opacityLayer)
        };
    console.log(mapSave);
    axios.post('/map', {
        "name" : mapNewName,
        "map" : mapSave
        // User JWT
    })
    .then(function(response){
        console.log("New save successful");
        console.log(response.data);
        curID = response.data.id;
        newFileName.hidden = true;
        showSaveNewButton.hidden = false;
        postMapButton.hidden = true;
        saveCurMapButton.hidden = false;
    })
}


function getMapList(e){
    console.log("Inside get map List");
    mapListDropdown.hidden = false;
    loadMapButton.hidden = false;
    openMapListButton.hidden = true;


}