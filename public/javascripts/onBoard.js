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
        pcRadio.checked = false;
        document.location.href='/dm';
        localStorage.setItem("role", "dm");
    }
    if (pcRadio.checked){
        dmRadio.checked = false;
        document.location.href = '/users';
        localStorage.setItem("role", "pc");
    }
};


onboardSubmitButton.addEventListener('click',function(){onboard()});
