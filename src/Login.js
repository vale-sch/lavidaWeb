var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { onStartChatManager } from "./ChatManager.js";
import { cleanLogin, createChatPage } from "./SiteChanger.js";
import { connectClientID } from "./SocketConnection.js";
import { User } from "./User.js";
let buttonInput = document.getElementById("loginBtn");
let userLogin = document.getElementById("loginUser");
let userPassword = document.getElementById("loginPW");
let eventOnEnter;
onStartLogin();
function onStartLogin() {
    addEvents();
}
function addEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        if (buttonInput == null)
            return;
        yield User.fetchUsers();
        if (User.usersDB != null) {
            eventOnEnter = (e) => __awaiter(this, void 0, void 0, function* () {
                if (e.key === 'Enter') {
                    yield checkCredentials();
                }
            });
            buttonInput.addEventListener("click", checkCredentials);
            document.addEventListener('keydown', eventOnEnter);
        }
    });
}
function checkCredentials() {
    return __awaiter(this, void 0, void 0, function* () {
        let login = false;
        if (!userLogin.value || !userPassword.value)
            return;
        for (let userDB of User.usersDB) {
            if (userLogin.value == userDB.name) {
                if (userPassword.value == userDB.password) {
                    login = true;
                    User.me = userDB;
                    break;
                }
            }
        }
        if (login) {
            document.removeEventListener('keydown', eventOnEnter);
            cleanLogin();
            createChatPage();
            connectClientID(User.me.id);
            onStartChatManager();
        }
        else
            alert("Wrong Username or Password, try again.");
    });
}
