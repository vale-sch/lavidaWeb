import { onStartChatManager } from "./ChatManager.js";
import { cleanLogin, createChatPage } from "./SiteChanger.js";
import { connectClientID } from "./SocketConnection.js";
import { User } from "./User.js";


let buttonDiv: HTMLInputElement = document.getElementById("loginBtn") as HTMLInputElement;

let userLogin: HTMLInputElement = document.getElementById("loginUser") as HTMLInputElement;
let userPassword: HTMLInputElement = document.getElementById("loginPW") as HTMLInputElement;
export let me: User;
let eventOnEnter: any;
onStartLogin();

function onStartLogin() {
    addEvents();
}



async function addEvents(): Promise<void> {
    if (buttonDiv == null) return;
    await User.fetchUsers();
    if (User.usersDB != null) {
        buttonDiv.addEventListener("onclick", checkCredentials);
        eventOnEnter = async (e: any) => {
            if ((e as KeyboardEvent).key === 'Enter') {
                await checkCredentials();
            }
        };
        document.addEventListener('keydown', eventOnEnter);

    }
}
async function checkCredentials() {
    let login: boolean = false;

    if (!userLogin.value || !userPassword.value) return;
    for (let userDB of User.usersDB) {
        if (userLogin.value == userDB.Name) {
            if (userPassword.value == userDB.Password) {
                login = true;
                me = userDB;
                break;
            }
        }
    }
    if (login) {
        document.removeEventListener('keydown', eventOnEnter);
        cleanLogin();
        createChatPage();
        connectClientID(me.Id);
        onStartChatManager();
    } else
        alert("Wrong Username or Password, try again.");
}

