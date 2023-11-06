"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var lavida;
(function (lavida) {
    let buttonDiv = document.getElementById("registration");
    buttonDiv.addEventListener("click", registrateMe);
    function registrateMe() {
        let nameValue = document.getElementById("name").value;
        let passwordValue = document.getElementById("password").value;
        if (!nameValue || !passwordValue)
            return;
        createUser(Math.floor((Date.now() + Math.random()) / 10000), nameValue, passwordValue);
    }
    function createUser(_id, _name, _password) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestData = {
                id: _id,
                name: _name,
                password: _password,
                isActive: true
            };
            try {
                let response = yield fetch('https://lavida-server.vercel.app/api/create_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });
                if (response.status === 201) {
                    let data = yield response.json();
                    window.location.replace("landing_page.html");
                }
                else {
                    let data = yield response.json();
                    console.log(`Error: ${data.error}`);
                    alert("You have been successfull registrated!");
                }
            }
            catch (error) {
                console.error('Error creating user:', error);
            }
        });
    }
})(lavida || (lavida = {}));
