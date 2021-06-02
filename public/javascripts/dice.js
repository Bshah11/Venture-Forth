// arrays of possible values for different dice
dice = {"d4": _.range(1,5), "d6": _.range(1,7),"d8": _.range(1,9),"d10": _.range(1,11),"d12":_.range(1,13),"d20": _.range(1,21)}

var diceSounds= ['music/dice1.wav', 'music/dice2.mp3', 'music/dice3.mp3', 'music/dice4.wav', 'music/dice5.mp3'];
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

//Set up the chat form
var chatInput = document.getElementById("chatInput");
var sendChatButton = document.getElementById('sendChatButton')
sendChatButton.addEventListener('click',function(){chatDisplay(chatInput.value)});
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
    //Play a random dice sound when user clicks on dice button
    var audio = new Audio(_.sample(diceSounds));
    audio.play();
    var curRoll = rollDice(dice);
    rollResult = rollResult + curRoll;
    let payload = {};
    console.log("Socket: "+socket.username);
    //diceResultNode.nodeValue = diceResult;
    recipient = playerList.value;
    //If the recipient is global, we broadcast to all players
    if(recipient == 'global'){
        diceResult = socket.username + " rolled a "+ dice + " for: "+curRoll
        payload.diceResult = diceResult;
        socket.emit("globalRoll", payload);
        var item = document.createElement('li');
        item.className +='list-group-item';
        item.textContent = payload.diceResult;
        chatLog.appendChild(item);
        stayScrolled(chatCard);
    }
    else if(recipient == 'private'){
        diceResult = "You rolled a "+ dice + " for: "+curRoll
        payload.diceResult = diceResult;
        var item = document.createElement('li');
        item.className +='list-group-item';
        item.textContent = payload.diceResult;
        chatLog.appendChild(item);
        stayScrolled(chatCard);
    }
    //Else we send a directed message using sendChat
    else {
        diceResult = "Private roll from: "+socket.username + " to "+playerList.options[playerList.selectedIndex].text+". They rolled a "+ dice + " for: "+curRoll
        payload.diceResult = diceResult;
        payload.to = recipient;
        console.log("Recipient "+ recipient);
        socket.emit("sendRoll", payload);
        //turnDisplayTextNode.nodeValue = rollResult;
        var item = document.createElement('li');
        item.className +='list-group-item';
        item.textContent = payload.diceResult;
        chatLog.appendChild(item);
        stayScrolled(chatCard);
    }
}

//If the user presses enter, send whatever is present in the chat input box
function search(ele){
    if(ele.keyCode == 13 ){
        chatDisplay(chatInput.value);
    }
}

//Function to display chats
function chatDisplay(chat) {
    //If the message is blank, return
    if(chat == ''){
        return;
    }
    //Clear the chat input box
    chatInput.value='';

    let payload = {};
    let recipient = playerList.value;
    //If the recipient is global, we broadcast to all players
    if(recipient == 'global'){
        chatText = socket.username + " says: "+ chat
        payload.chat = chatText;
        socket.emit("globalChat", payload);
        var item = document.createElement('li');
        item.className +='list-group-item';
        item.textContent = payload.chat;
        chatLog.appendChild(item);
        stayScrolled(chatCard);
    }
    else if(recipient == 'private'){
        chatText = "You say to yourself: "+ chat
        payload.chat = chatText;
        var item = document.createElement('li');
        item.className +='list-group-item';
        item.textContent = payload.chat;
        chatLog.appendChild(item);
        stayScrolled(chatCard);
    }
    //Else we send a directed message using sendChat
    else {
        chatText = "Private message from "+socket.username + " to "+playerList.options[playerList.selectedIndex].text+": "+ chat
        payload.chat = chatText;
        payload.to = recipient;
        console.log("Recipient "+ recipient);
        socket.emit("sendChat", payload);
        //turnDisplayTextNode.nodeValue = rollResult;
        var item = document.createElement('li');
        item.className +='list-group-item';
        item.textContent = payload.chat;
        chatLog.appendChild(item);
        stayScrolled(chatCard);
    }
}

//This endpoint is for a directed roll at a single user
socket.on('sendRoll',(payload, from) => {
    console.log("sendChat browser payload: "+payload.payload.diceResult);
    var item = document.createElement('li');
    item.className +='list-group-item';
    item.textContent = payload.payload.diceResult;
    chatLog.appendChild(item);
    stayScrolled(chatCard);
    });

//This is for global dice rolls
socket.on('allRoll',(payload, from) => {
    console.log("allRoll browser payload: "+payload.diceResult);
    var item = document.createElement('li');
    item.className +='list-group-item';
    item.textContent = payload.diceResult;
    chatLog.appendChild(item);
    stayScrolled(chatCard);
});

//This endpoint is for a directed chat at a single user
socket.on('sendChat',(payload, from) => {
    var item = document.createElement('li');
    item.className +='list-group-item';
    item.textContent = payload.payload.chat;
    chatLog.appendChild(item);
    stayScrolled(chatCard);
    });

//This is for global chat
socket.on('allChat',(payload, from) => {
    console.log("allChat browser payload: "+payload.chat);
    var item = document.createElement('li');
    item.className +='list-group-item';
    item.textContent = payload.chat;
    chatLog.appendChild(item);
    stayScrolled(chatCard);
});

//Get all users and build user dropdown menu
socket.on('get users', (users) => {
    playerList.innerHTML='';
    //Create the private Item to only display to you
    var private = document.createElement('option');
    private.style.fontSize = "smaller";
    private.value = "private";
    private.textContent = "Private";
    playerList.appendChild(private);
    //Create the global item in the list which will broadcast to all players
    var global = document.createElement('option');
    global.style.fontSize = "smaller";
    global.value = "global";
    global.textContent = "Global";
    playerList.appendChild(global);
    //Loop through all connected users and add them to the list below global
    users.forEach((user) =>{
        //Don't add your own username to the list
        if(user.userID == socket.id){
            return;
        }else{
            var item = document.createElement('option');
            item.style.fontSize = "smaller";
            item.value = user.userID;
            console.log("userID when making list: "+user.userID);
            item.textContent = user.username;
            playerList.appendChild(item);
        }
    })
});

function stayScrolled(elem){
    //console.log("in stayScrolled");
    elem.scrollTop = elem.scrollHeight;
}
