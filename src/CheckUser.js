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
    let users = [];
    fetchUsers();
    let buttonDiv = document.getElementById("loginBtn");
    buttonDiv.onclick = checkCredentials;
    let userLogin = document.getElementById("loginUser");
    let userPassword = document.getElementById("loginPW");
    function fetchUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://lavida-server.vercel.app/api/get_users');
                users = yield response.json();
            }
            catch (error) {
                console.error('Error fetching users:', error);
            }
        });
    }
    function checkCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userLogin.value || !userPassword.value)
                return;
            let thisUser = new lavida.User(0, "", "", false);
            users.forEach((userDB) => {
                if (userLogin.value === userDB.name) {
                    if (userPassword.value === userDB.password) {
                        thisUser = userDB;
                    }
                }
            });
            yield new Promise(f => setTimeout(f, 100));
            if (thisUser.id != 0) {
                window.location.replace(`overview.html?user=${encodeURIComponent(userLogin.value)}`);
            }
        });
    }
})(lavida || (lavida = {}));
