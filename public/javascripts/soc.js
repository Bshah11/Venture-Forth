var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    console.log(curMapState);
    let payload = {};
    payload.mapState = curMapState;
    payload.msg = input.value;
    socket.emit('chat message', payload);
    input.value = '';
  }
});

socket.on('chat message', function(payload) {
  var item = document.createElement('li');
  item.textContent = payload.msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  loadMapLayer(payload.mapState, mapLayer);
});


/*
form.addEventListener('submit', sendToSocket);


function sendToSocket(e){
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
        console.log(stage);
    }
}

*/