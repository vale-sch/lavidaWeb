import { onStartChatManager } from "./ChatManager.js";
import { cleanLogin, createChatPage, hideLoadingOverlay, showLoadingOverlay } from "./SiteChanger.js";
import { connectClientID } from "./SocketConnection.js";
import { User } from "./User.js";


let buttonInput: HTMLInputElement = document.getElementById("loginBtn") as HTMLInputElement;

let userLogin: HTMLInputElement = document.getElementById("loginUser") as HTMLInputElement;
let userPassword: HTMLInputElement = document.getElementById("loginPW") as HTMLInputElement;
let eventOnEnter: any;
onStartLogin();

function onStartLogin() {
    addEvents();
}



async function addEvents(): Promise<void> {
    if (buttonInput == null) return;
    await User.fetchUsers();
    if (User.usersDB != null) {
        eventOnEnter = async (e: any) => {
            if ((e as KeyboardEvent).key === 'Enter') {
                await checkCredentials();
            }
        };
        buttonInput.addEventListener("click", checkCredentials);
        document.addEventListener('keydown', eventOnEnter);

    }
}
async function checkCredentials() {
    let login: boolean = false;
    if (!userLogin.value || !userPassword.value) return;
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
        showLoadingOverlay();
        document.removeEventListener('keydown', eventOnEnter);
        cleanLogin();
        createChatPage();
        connectClientID(User.me.id);

        await User.fetchUsers();
        onStartChatManager();
    } else
        alert("Wrong Username or Password, try again.");
}

