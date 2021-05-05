// arrays of possible values for different dice
dice = {"d4": _.range(1,5), "d6": _.range(1,7),"d8": _.range(1,9),"d10": _.range(1,11),"d12":_.range(1,13),"d20": _.range(1,21)}

//Event listners
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

var diceResult = '';
var rollResult = 0;

//This will be used to display the successive dice rolls
var diceDisplay = document.getElementById('roll-results');
var diceResultNode = document.createTextNode("");
diceDisplay.appendChild(diceResultNode);

//This will display the turn total
var turnDisplay = document.getElementById('turn-result');
var turnDisplayTextNode = document.createTextNode("");
turnDisplay.style.fontSize='larger';
turnDisplay.style.fontWeight='bold';
turnDisplay.appendChild(turnDisplayTextNode);

//Roll dice function
function rollDice(typeDie){
    //input is the sides of the die to roll.
    return result = _.sample(dice[typeDie]);
}



//Function to display the number of die and their result
function rollDisplay(dice) {
    var curRoll = rollDice(dice);
    rollResult = rollResult + curRoll;
    if (diceResult == ''){
        diceResult = curRoll;
        diceResultNode.nodeValue = diceResult;
        turnDisplayTextNode.nodeValue = rollResult;
    }
    else{
        diceResult = diceResult+"+"+curRoll
        diceResultNode.nodeValue = diceResult;
        turnDisplayTextNode.nodeValue = rollResult;
    }
}
