var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { onStartOverview } from "./Overview.js";
import { cleanLogin, createOvervieHTML } from "./SiteChanger.js";
import { connectClientID } from "./SocketConnection.js";
import { User } from "./User.js";
let buttonDiv = document.getElementById("loginBtn");
let userLogin = document.getElementById("loginUser");
let userPassword = document.getElementById("loginPW");
export let me;
let eventOnEnter;
let hasCleaned = false;
onStartLogin();
function onStartLogin() {
    addEvents();
}
function addEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        if (buttonDiv == null)
            return;
        yield User.fetchUsers();
        console.log("hasFetched");
        if (User.usersDB != null) {
            buttonDiv.onclick = checkCredentials;
            eventOnEnter = document.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
                if (e.key === 'Enter') {
                    yield checkCredentials();
                }
            }));
        }
    });
}
function checkCredentials() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userLogin.value || !userPassword.value || hasCleaned)
            return;
        User.usersDB.forEach((userDB) => {
            if (userLogin.value == userDB.Name) {
                if (userPassword.value == userDB.Password) {
                    me = userDB;
                    console.log(me);
                }
            }
        });
        document.removeEventListener('keydown', eventOnEnter);
        cleanLogin();
        createOvervieHTML();
        onStartOverview();
        connectClientID(me.Id);
        hasCleaned = true;
    });
}
