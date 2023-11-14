"use strict";
var lavida;
(function (lavida) {
    let buttonDiv = document.getElementById("registration");
    buttonDiv.addEventListener("click", registrateMe);
    function registrateMe() {
        let nameValue = document.getElementById("name").value;
        let passwordValue = document.getElementById("password").value;
        if (!nameValue || !passwordValue)
            return;
        let newUser = new lavida.User(Math.floor((Date.now() + Math.random()) / 10000), nameValue, passwordValue, true);
        newUser.pushUser();
    }
})(lavida || (lavida = {}));
