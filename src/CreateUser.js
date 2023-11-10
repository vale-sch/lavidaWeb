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
            let newUser = new lavida.User(_id, _name, _password, true);
            try {
                let response = yield fetch('https://lavida-server.vercel.app/api/create_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
                if (response.status === 201) {
                    yield response.json();
                    window.location.replace("landing_page.html");
                    alert("You have been successfull registrated!");
                }
                else {
                    let data = yield response.json();
                    console.log(`Error: ${data.error}`);
                }
            }
            catch (error) {
                console.error('Error creating user:', error);
            }
        });
    }
    sendMsg("joacchim", "joachim", "quatsch laber nicht 1");
    function sendMsg(chatID, senderID, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = new Message(chatID, senderID, message);
            try {
                let response = yield fetch('https://lavida-server.vercel.app/api/send_msg', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(msg),
                });
                if (response.status === 201) {
                    let responseFirebase = yield response.text();
                    console.log(responseFirebase);
                    //  window.location.replace("landing_page.html");
                    //alert("You have been successfull registrated!")
                }
                else {
                    let data = yield response.json();
                    console.log(`Error: ${data.error}`);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // deleteChat("joacchim");
    function deleteChat(_chatID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatID = {
                    chatID: _chatID
                };
                let response = yield fetch('https://deletechat-mfccjlsnga-uc.a.run.app', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(chatID),
                });
                if (response.status === 201) {
                    let responseFirebase = yield response.text();
                    console.log(responseFirebase);
                    //  window.location.replace("landing_page.html");
                    //alert("You have been successfull registrated!")
                }
                else {
                    let data = yield response.json();
                    console.log(`Error: ${data.error}`);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function fetchChatEvery100ms(chatID) {
        return __awaiter(this, void 0, void 0, function* () {
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`https://receivechat-mfccjlsnga-uc.a.run.app?chatID=${chatID}`);
                    let chat = yield response.json();
                    console.log(chat);
                }
                catch (error) {
                    console.error('Error fetching chat:', error);
                }
            }), 100); // 100 milliseconds
        });
    }
    // Call the function to start fetching data every 100ms
    //fetchChatEvery100ms("joachim");
})(lavida || (lavida = {}));
