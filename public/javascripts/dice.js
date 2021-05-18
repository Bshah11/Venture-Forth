// arrays of possible values for different dice
dice = {"d4": _.range(1,5), "d6": _.range(1,7),"d8": _.range(1,9),"d10": _.range(1,11),"d12":_.range(1,13),"d20": _.range(1,21)}

//Event listners for dice buttons
var d4 = document.getElementById('d4Dice');
d4.addEventListener('click',function(){rollDisplay(d4.value)});
var d6 = document.getElementById('d6Dice');
d6.addEventListener('click',function(){rollDisplay(d6.value)});
var d8 = document.getElementById('d8Dice');
d8.addEventListener('click',function(){rollDisplay(d8.value)});
var d10 = document.getElementById('d10Dice');
d10.addEventListener('click',function(){rollDisplay(d10.value)});
var d12 = document.getElementById('d12Dice');
d12.addEventListener('click',function(){rollDisplay(d12.value)});
var d20 = document.getElementById('d20Dice');
d20.addEventListener('click',function(){rollDisplay(d20.value)});

//Get the necessary elements to append to in chat box
var chatLog = document.getElementById('chatLog');
var chatCard = document.getElementById('chatCard');

//Get the select bar to be able to update when users join room
var playerList = document.getElementById('playerList');

var diceResult = '';
var rollResult = 0;

// //This will be used to display the successive dice rolls
// var diceDisplay = document.getElementById('roll-results');
// var diceResultNode = document.createTextNode("");
// diceDisplay.appendChild(diceResultNode);

// //This will display the turn total
// var turnDisplay = document.getElementById('turn-result');
// var turnDisplayTextNode = document.createTextNode("");
// turnDisplay.style.fontSize='larger';
// turnDisplay.style.fontWeight='bold';
// turnDisplay.appendChild(turnDisplayTextNode);

// //Clear dice rolls
// var clearDisplay = document.getElementById('clear-results');
// clearDisplay.addEventListener('click', function(){clearDisplayNodes()});

//Roll dice function
function rollDice(typeDie){
    //input is the sides of the die to roll.
    return result = _.sample(dice[typeDie]);
}



//Function to display the number of die and their result
function rollDisplay(dice) {
    var curRoll = rollDice(dice);
    rollResult = rollResult + curRoll;
    let payload = {};
    console.log("Socket: "+socket.username);
    diceResult = socket.username + ": rolled a "+ dice + " for: "+curRoll
    //diceResultNode.nodeValue = diceResult;
    payload.diceResult = diceResult;
    recipient = playerList.value;
    //If the recipient is global, we broadcast to all players
    if(recipient == 'global'){
        socket.emit("globalChat", payload);
        var item = document.createElement('li');
        item.className +='list-group-item';
        item.textContent = payload.diceResult;
        chatLog.appendChild(item);
        stayScrolled(chatCard);
    }
    //Else we send a directed message using sendChat
    else {
        payload.to = recipient;
        console.log("Recipient "+ recipient);
        socket.emit("sendChat", payload);
        //turnDisplayTextNode.nodeValue = rollResult;
        var item = document.createElement('li');
        item.className +='list-group-item';
        item.textContent = payload.diceResult;
        chatLog.appendChild(item);
        stayScrolled(chatCard);
    }
}

//This endpoint is for a directed chat at a single user
socket.on('sendChat',(payload, from) => {
    // console.log("in sendchat browser");
    // var users = payload.payload.users;
    // for(let i=0; i<users.length;i++){
    //     // const user = users[i];
    //     // console.log("user in displaychat: "+user)
    //     // console.log(user);
    //     // console.log("from in displayChat "+ payload.from);
    //     // console.log(payload.from);
    //     // console.log("this is true");
    //     var item = document.createElement('li');
    //     item.className +='list-group-item';
    //     item.textContent = payload.payload.diceResult;
    //     chatLog.appendChild(item);
    //     stayScrolled(chatCard);
    console.log("sendChat browser payload: "+payload.payload.diceResult);
    var item = document.createElement('li');
    item.className +='list-group-item';
    item.textContent = payload.payload.diceResult;
    chatLog.appendChild(item);
    stayScrolled(chatCard);
    });
    socket.on('allChat',(payload, from) => {
        // console.log("in sendchat browser");
        // var users = payload.payload.users;
        // for(let i=0; i<users.length;i++){
        //     // const user = users[i];
        //     // console.log("user in displaychat: "+user)
        //     // console.log(user);
        //     // console.log("from in displayChat "+ payload.from);
        //     // console.log(payload.from);
        //     // console.log("this is true");
        //     var item = document.createElement('li');
        //     item.className +='list-group-item';
        //     item.textContent = payload.payload.diceResult;
        //     chatLog.appendChild(item);
        //     stayScrolled(chatCard);
        console.log("allChat browser payload: "+payload.diceResult);
        var item = document.createElement('li');
        item.className +='list-group-item';
        item.textContent = payload.diceResult;
        chatLog.appendChild(item);
        stayScrolled(chatCard);
    });
socket.on('get users', (users) => {
    console.log("users in get users "+users[0].userID)
    playerList.innerHTML='';
    //Create the global item in the list which will broadcast to all players
    var global = document.createElement('option');
    global.style.fontSize = "smaller";
    global.value = "global";
    global.textContent = "Global";
    playerList.appendChild(global);
    //Loop through all connected users and add them to the list below global
    users.forEach((user) =>{
        var item = document.createElement('option');
        item.style.fontSize = "smaller";
        item.value = user.userID;
        console.log("userID when making list: "+user.userID);
        item.textContent = user.username;
        playerList.appendChild(item);
    })
});
// socket.on("user connected", ({userID, username}) => {
//     console.log('in user connected');
//     var item = document.createElement('option');
//     item.style.fontSize = "smaller";
//     item.value = userID;
//     console.log("userID when making list: "+userID);
//     item.textContent = username;
//     playerList.appendChild(item);
// });


function stayScrolled(elem){
    //console.log("in stayScrolled");
    elem.scrollTop = elem.scrollHeight;
}

// function clearDisplayNodes(){
//     diceResultNode.nodeValue = '';
//     turnDisplayTextNode.nodeValue= '';
//     diceResult = '';
//     rollResult=0;
// }
