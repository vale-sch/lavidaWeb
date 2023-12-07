var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "./User.js";
let buttonDiv = document.getElementById("loginBtn");
let userLogin = document.getElementById("loginUser");
let userPassword = document.getElementById("loginPW");
addEvents();
function addEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        if (buttonDiv == null)
            return;
        yield User.fetchUsers();
        console.log("HAS FETCHED");
        if (User.usersDB != null) {
            buttonDiv.onclick = checkCredentials;
            document.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
                if (e.key === 'Enter') {
                    yield checkCredentials();
                }
            }));
        }
    });
}
function checkCredentials() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log((!userLogin.value || !userPassword.value));
        if (!userLogin.value || !userPassword.value)
            return;
        let thisUser = new User(0, "", "");
        User.usersDB.forEach((userDB) => {
            if (userLogin.value == userDB.Name) {
                console.log(userDB.Name);
                if (userPassword.value == userDB.Password) {
                    thisUser = userDB;
                }
            }
        });
        yield new Promise(f => setTimeout(f, 50));
        if (thisUser.Id != 0) {
            window.location.replace(`overview_page.html?user=${encodeURIComponent(userLogin.value)}`);
        }
    });
}
