var onboardSubmitButton = document.getElementById('onBoardSubmit');
var usernameInput = document.getElementById('username');
var dmRadio = document.getElementById('dm');
var pcRadio = document.getElementById('pc');

function onboard() {
    console.log("attempting to submit");
    localStorage.setItem("username",  usernameInput.value);
    // socket.auth = { username };
    // socket.connect();
    if (dmRadio.checked){
        document.location.href='/dm';
    }
    if (pcRadio.checked){
        document.location.href = '/users';
    }
};


onboardSubmitButton.addEventListener('click',function(){onboard()});
